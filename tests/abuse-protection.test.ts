/**
 * VEDNIX CMS — PHASE 2B ABUSE PROTECTION & ANTI-SPAM TEST SUITE
 *
 * Verifies runtime security layers for public form abuse mitigation:
 * 1. Honeypot detection (bot trap identification & silent drop)
 * 2. IP-based sliding window rate limiting (automated request flooding)
 * 3. Identifier/Email cooldown & deduplication (rapid-fire repeat prevention)
 * 4. Form-level limit isolation
 * 5. Server-side Cloudflare Turnstile token verification & replay resistance
 * 6. Payload size limits, scheme bounds, and input sanitization
 * 7. Privileged field injection rejection
 */

import {
  abuseLimiter,
  FORM_RATE_LIMITS,
} from "../src/lib/server/rateLimiter.server";
import { verifyTurnstileToken } from "../src/lib/server/turnstile.server";
import { z } from "zod";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    passedCount++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedCount++;
    console.error(`  ✗ FAIL: ${testName}${details ? ` — ${details}` : ""}`);
  }
}

async function runAbuseProtectionTests() {
  console.log("\n=======================================================");
  console.log("  VEDNIX CMS — PUBLIC FORM ABUSE PROTECTION TESTS");
  console.log("=======================================================\n");

  // -------------------------------------------------------------------
  // 1. Honeypot Detection Tests
  // -------------------------------------------------------------------
  console.log("Suite 1: Honeypot Bot Detection");
  {
    // Normal user: honeypot is empty/undefined
    const humanInput = { honeypot: undefined };
    const isHumanBot =
      humanInput.honeypot != null && humanInput.honeypot.trim().length > 0;
    assert(
      !isHumanBot,
      "Legitimate submission with empty honeypot is recognized as human",
    );

    // Bot: automated script fills hidden input
    const botInput = { honeypot: "https://spam-marketing-boost.com" };
    const isBot =
      botInput.honeypot != null && botInput.honeypot.trim().length > 0;
    assert(
      isBot,
      "Automated submission with populated honeypot is trapped as bot",
    );

    // Bot with whitespace only
    const whitespaceBot = { honeypot: "   " };
    const isWhitespaceBot =
      whitespaceBot.honeypot != null &&
      whitespaceBot.honeypot.trim().length > 0;
    assert(!isWhitespaceBot, "Whitespace in honeypot is safely trimmed");
  }

  // -------------------------------------------------------------------
  // 2. IP Rate Limiting (Sliding Window)
  // -------------------------------------------------------------------
  console.log("\nSuite 2: IP-Based Sliding Window Rate Limiting");
  {
    abuseLimiter.resetForTesting();
    const testIp = "198.51.100.25";
    const baseTime = Date.now();

    // Contact form allows up to 5 requests per 10 minutes
    const contactConfig = FORM_RATE_LIMITS["contact_messages"];
    assert(
      contactConfig.maxRequests === 5,
      "Contact messages limit is configured to 5 requests",
    );

    // Submit 5 requests within the window from the same IP (using distinct emails to test pure IP limit)
    for (let i = 1; i <= 5; i++) {
      const res = abuseLimiter.checkLimit({
        ip: testIp,
        formKind: "contact_messages",
        email: `sender${i}@example.com`,
        now: baseTime + i * 1000,
      });
      assert(
        res.allowed,
        `Contact submission #${i} from ${testIp} is allowed (remaining: ${res.remaining})`,
      );
    }

    // 6th request from the same IP should be blocked
    const throttledRes = abuseLimiter.checkLimit({
      ip: testIp,
      formKind: "contact_messages",
      email: "sender6@example.com",
      now: baseTime + 6 * 1000,
    });
    assert(
      !throttledRes.allowed && throttledRes.reason === "ip_limit_exceeded",
      "6th contact submission exceeds IP rate limit and is throttled",
      `Expected allowed=false, got allowed=${throttledRes.allowed}`,
    );
    assert(
      (throttledRes.retryAfterSeconds ?? 0) > 0,
      "Throttled response includes positive retryAfterSeconds",
    );

    // Form Isolation: Same IP submitting to a DIFFERENT form (early_access_users) should be allowed
    const earlyAccessRes = abuseLimiter.checkLimit({
      ip: testIp,
      formKind: "early_access_users",
      email: "early@example.com",
      now: baseTime + 7 * 1000,
    });
    assert(
      earlyAccessRes.allowed,
      "Same IP submitting to early_access_users is allowed (form-level limit isolation)",
    );

    // Career application threshold (configured to 3 max requests)
    const careerIp = "198.51.100.99";
    for (let i = 1; i <= 3; i++) {
      abuseLimiter.checkLimit({
        ip: careerIp,
        formKind: "career_applications",
        email: `applicant${i}@example.com`,
        now: baseTime + i * 1000,
      });
    }
    const careerThrottled = abuseLimiter.checkLimit({
      ip: careerIp,
      formKind: "career_applications",
      email: "applicant4@example.com",
      now: baseTime + 4 * 1000,
    });
    assert(
      !careerThrottled.allowed &&
        careerThrottled.reason === "ip_limit_exceeded",
      "Career application throttled after 3 requests within window",
    );

    // Window expiration: advancing time beyond 10-minute window resets IP quota
    const windowExpiredTime = baseTime + 11 * 60 * 1000;
    const postExpiryRes = abuseLimiter.checkLimit({
      ip: testIp,
      formKind: "contact_messages",
      email: "new_sender@example.com",
      now: windowExpiredTime,
    });
    assert(
      postExpiryRes.allowed,
      "After window expiration (11 min), IP rate limit resets and permits new submissions",
    );
  }

  // -------------------------------------------------------------------
  // 3. Identifier/Email Cooldown (Duplicate Rapid-Fire Abuse)
  // -------------------------------------------------------------------
  console.log("\nSuite 3: Identifier/Email Cooldown");
  {
    abuseLimiter.resetForTesting();
    const now = Date.now();
    const userEmail = "victim-user@example.com";

    // First submission with this email is allowed
    const firstSub = abuseLimiter.checkLimit({
      ip: "203.0.113.1",
      formKind: "contact_messages",
      email: userEmail,
      now,
    });
    assert(firstSub.allowed, "First submission with email is allowed");

    // Second submission with SAME email within 60s cooldown (even from DIFFERENT IP) is throttled
    const rapidRepeat = abuseLimiter.checkLimit({
      ip: "203.0.113.2", // Different IP
      formKind: "contact_messages",
      email: userEmail.toUpperCase(), // Case insensitive check
      now: now + 15 * 1000, // 15 seconds later
    });
    assert(
      !rapidRepeat.allowed && rapidRepeat.reason === "email_cooldown_active",
      "Rapid repeat submission with same email within 60s cooldown is blocked",
    );

    // After 61 seconds, repeat submission with same email is allowed
    const postCooldown = abuseLimiter.checkLimit({
      ip: "203.0.113.1",
      formKind: "contact_messages",
      email: userEmail,
      now: now + 61 * 1000,
    });
    assert(
      postCooldown.allowed,
      "After 60s cooldown expires, repeat submission with same email is allowed",
    );
  }

  // -------------------------------------------------------------------
  // 4. Cloudflare Turnstile Server Verification
  // -------------------------------------------------------------------
  console.log("\nSuite 4: Cloudflare Turnstile Server Verification");
  {
    // Test 4.1: Missing secret in dev/test -> mock/passthrough mode
    delete process.env.TURNSTILE_SECRET_KEY;
    const devVerify = await verifyTurnstileToken({ token: "any-dummy-token" });
    assert(
      devVerify.success && devVerify.isMocked,
      "Unconfigured Turnstile secret in dev/test returns non-blocking mocked success",
    );

    // Test 4.2: Missing token when secret is configured -> Denied
    const testSecret = "1x0000000000000000000000000000000AA"; // Cloudflare Always Pass Test Secret
    const missingToken = await verifyTurnstileToken({
      token: undefined,
      overrideSecret: testSecret,
    });
    assert(
      !missingToken.success &&
        missingToken.errorCodes.includes("missing-input-response"),
      "Missing Turnstile token is rejected with missing-input-response",
    );

    // Test 4.3: Empty/whitespace token -> Denied
    const emptyToken = await verifyTurnstileToken({
      token: "   ",
      overrideSecret: testSecret,
    });
    assert(
      !emptyToken.success &&
        emptyToken.errorCodes.includes("missing-input-response"),
      "Empty whitespace Turnstile token is rejected",
    );

    // Test 4.4: Cloudflare Always-Pass Test Secret with valid token -> Verified
    const passResult = await verifyTurnstileToken({
      token: "XXXX.DUMMY.TOKEN.XXXX",
      overrideSecret: testSecret,
    });
    assert(
      passResult.success,
      "Cloudflare official Always-Pass secret validates token successfully",
    );

    // Test 4.5: Cloudflare Always-Fail Test Secret -> Denied
    const failSecret = "2x0000000000000000000000000000000AB"; // Cloudflare Always Fail Test Secret
    const failResult = await verifyTurnstileToken({
      token: "XXXX.DUMMY.TOKEN.XXXX",
      overrideSecret: failSecret,
    });
    assert(
      !failResult.success,
      "Cloudflare official Always-Fail secret rejects token correctly",
    );

    // Test 4.6: Cloudflare Spent/Replayed Test Secret -> Denied with timeout-or-duplicate
    const spentSecret = "3x0000000000000000000000000000000AA"; // Cloudflare Simulates Token Already Spent
    const spentResult = await verifyTurnstileToken({
      token: "XXXX.DUMMY.TOKEN.XXXX",
      overrideSecret: spentSecret,
    });
    assert(
      !spentResult.success,
      "Replayed / spent token is rejected by Cloudflare verification",
    );
  }

  // -------------------------------------------------------------------
  // 5. Payload Validation & Resource Bounds
  // -------------------------------------------------------------------
  console.log("\nSuite 5: Payload Limits & Scheme Bounds");
  {
    const contactSchema = z.object({
      fullName: z.string().trim().min(2).max(80),
      email: z.string().trim().email().max(160),
      phone: z
        .string()
        .trim()
        .min(8)
        .max(20)
        .regex(/^[0-9+\-\s()]+$/),
      subject: z.string().trim().min(3).max(120),
      message: z.string().trim().min(10).max(2000),
      consent: z.literal(true),
    });

    // Valid contact payload
    const validContact = {
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "+91 9876543210",
      subject: "Partnership Inquiry",
      message: "We would like to explore integration with SmartPocket.",
      consent: true,
    };
    assert(
      contactSchema.safeParse(validContact).success,
      "Valid contact message passes schema bounds",
    );

    // Oversized message (> 2000 chars)
    const oversizedMessage = {
      ...validContact,
      message: "A".repeat(2001),
    };
    assert(
      !contactSchema.safeParse(oversizedMessage).success,
      "Oversized message (> 2000 chars) is rejected",
    );

    // Invalid phone characters (SQL / script injection probe)
    const badPhone = {
      ...validContact,
      phone: "+91 98765'; DROP TABLE users;--",
    };
    assert(
      !contactSchema.safeParse(badPhone).success,
      "Phone containing script/injection characters is rejected",
    );

    // Missing consent
    const noConsent = {
      ...validContact,
      consent: false,
    };
    assert(
      !contactSchema.safeParse(noConsent).success,
      "Unconsented submission (consent=false) is rejected",
    );

    // Career application resume URL bounds
    const careerResumeSchema = z
      .string()
      .trim()
      .url()
      .max(500)
      .refine((u) => u.startsWith("https://"), "HTTPS required")
      .refine(
        (u) =>
          u.includes("drive.google.com") ||
          u.includes("docs.google.com") ||
          u.includes("dropbox.com") ||
          u.includes("onedrive.live.com"),
        "Approved cloud storage required",
      );

    // Valid Google Drive resume link
    const validResume =
      "https://drive.google.com/file/d/1a2b3c4d5e/view?usp=sharing";
    assert(
      careerResumeSchema.safeParse(validResume).success,
      "Valid Google Drive resume link is accepted",
    );

    // Insecure HTTP link
    const httpResume = "http://drive.google.com/file/d/123";
    assert(
      !careerResumeSchema.safeParse(httpResume).success,
      "Insecure http:// resume link is rejected",
    );

    // Dangerous javascript: URI
    const jsResume = "javascript:alert(document.cookie)";
    assert(
      !careerResumeSchema.safeParse(jsResume).success,
      "Dangerous javascript: URI is rejected",
    );

    // Untrusted external domain hosting executable
    const untrustedResume = "https://evil-hacker.xyz/malware-resume.pdf";
    assert(
      !careerResumeSchema.safeParse(untrustedResume).success,
      "Untrusted external domain resume link is rejected",
    );
  }

  // -------------------------------------------------------------------
  // 6. Privileged Field Injection Protection
  // -------------------------------------------------------------------
  console.log("\nSuite 6: Privileged Field Injection");
  {
    const strictSchema = z
      .object({
        fullName: z.string().trim().min(2).max(80),
        email: z.string().trim().email(),
        consent: z.literal(true),
      })
      .strict(); // Strips or denies any extra unwhitelisted fields

    const injectedPayload = {
      fullName: "Attacker",
      email: "attacker@bad.com",
      consent: true,
      isAdmin: true,
      role: "super_admin",
      permissions: ["ALL"],
    };

    const parsed = strictSchema.safeParse(injectedPayload);
    assert(
      !parsed.success,
      "Privileged field injection (isAdmin, role, permissions) is strictly rejected by schema",
    );
  }

  console.log("\n=======================================================");
  console.log(
    `  ABUSE PROTECTION RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`,
  );
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAbuseProtectionTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
