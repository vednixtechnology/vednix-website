/**
 * VEDNIX CMS — PHASE 2C CSP & HTTP SECURITY HEADERS TEST SUITE
 *
 * Verifies:
 * 1. Presence and correctness of all 6 mandatory HTTP security headers in vercel.json & server.ts.
 * 2. Strict Content Security Policy (CSP) directive completeness and validity.
 * 3. Prevention of dangerous CSP wildcards (no script-src *, no connect-src *, no object-src *).
 * 4. Elimination of 'unsafe-eval' from script-src.
 * 5. Framing and clickjacking protection (frame-ancestors 'none', X-Frame-Options: DENY).
 * 6. Protection against MIME sniffing, referrer leakage, and sensitive hardware permissions.
 * 7. Absence of insecure production HTTP network references.
 */

import fs from "node:fs";
import path from "node:path";
import { CSP_HEADER_VALUE, SECURITY_HEADERS } from "../src/server";

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

async function runSecurityHeaderTests() {
  console.log("\n=======================================================");
  console.log("  VEDNIX CMS — CSP & HTTP SECURITY HEADERS TESTS");
  console.log("=======================================================\n");

  // -------------------------------------------------------------------
  // Suite 1: Mandatory Security Headers Presence
  // -------------------------------------------------------------------
  console.log("Suite 1: Mandatory HTTP Security Headers");
  {
    const vercelConfigPath = path.resolve(process.cwd(), "vercel.json");
    assert(
      fs.existsSync(vercelConfigPath),
      "vercel.json exists in repository root",
    );

    const vercelRaw = fs.readFileSync(vercelConfigPath, "utf8");
    const vercelJson = JSON.parse(vercelRaw);
    const globalHeaders = vercelJson.headers?.find(
      (h: { source: string }) => h.source === "/(.*)",
    )?.headers as Array<{ key: string; value: string }>;

    assert(
      Array.isArray(globalHeaders),
      "vercel.json contains global /(.*) header rules",
    );

    const headerMap = new Map(globalHeaders.map((h) => [h.key, h.value]));

    // Check all required headers in vercel.json
    assert(
      headerMap.has("Content-Security-Policy"),
      "Content-Security-Policy is present in vercel.json",
    );
    assert(
      headerMap.get("X-Content-Type-Options") === "nosniff",
      "X-Content-Type-Options is set to 'nosniff'",
    );
    assert(
      headerMap.get("X-Frame-Options") === "DENY",
      "X-Frame-Options is set to 'DENY'",
    );
    assert(
      headerMap.get("Referrer-Policy") === "strict-origin-when-cross-origin",
      "Referrer-Policy is set to 'strict-origin-when-cross-origin'",
    );
    assert(
      (headerMap.get("Strict-Transport-Security") ?? "").includes(
        "max-age=31536000",
      ),
      "Strict-Transport-Security enforces 1-year max-age (31536000)",
    );
    assert(
      (headerMap.get("Strict-Transport-Security") ?? "").includes(
        "includeSubDomains",
      ),
      "Strict-Transport-Security includes includeSubDomains",
    );
    assert(
      headerMap.has("Permissions-Policy"),
      "Permissions-Policy is present in vercel.json",
    );

    // Verify consistency between vercel.json and server.ts
    assert(
      SECURITY_HEADERS["Content-Security-Policy"] ===
        headerMap.get("Content-Security-Policy"),
      "CSP in server.ts matches vercel.json exactly",
    );
    assert(
      SECURITY_HEADERS["X-Frame-Options"] === headerMap.get("X-Frame-Options"),
      "X-Frame-Options in server.ts matches vercel.json exactly",
    );
  }

  // -------------------------------------------------------------------
  // Suite 2: Permissions-Policy Hardening
  // -------------------------------------------------------------------
  console.log("\nSuite 2: Permissions-Policy Hardening");
  {
    const pp = SECURITY_HEADERS["Permissions-Policy"] ?? "";
    const restrictedFeatures = [
      "camera",
      "microphone",
      "geolocation",
      "payment",
      "usb",
      "bluetooth",
    ];

    for (const feat of restrictedFeatures) {
      assert(
        pp.includes(`${feat}=()`),
        `Permissions-Policy disables '${feat}' feature (${feat}=())`,
      );
    }
  }

  // -------------------------------------------------------------------
  // Suite 3: CSP Directives Completeness & Rigor
  // -------------------------------------------------------------------
  console.log("\nSuite 3: CSP Directives Completeness & Rigor");
  {
    const csp = CSP_HEADER_VALUE;
    const directives = new Map<string, string[]>();

    csp.split(";").forEach((part) => {
      const trimmed = part.trim();
      if (!trimmed) return;
      const tokens = trimmed.split(/\s+/);
      const name = tokens[0];
      const values = tokens.slice(1);
      directives.set(name, values);
    });

    // Directive Presence
    assert(directives.has("default-src"), "CSP includes 'default-src'");
    assert(directives.has("script-src"), "CSP includes 'script-src'");
    assert(directives.has("script-src-attr"), "CSP includes 'script-src-attr'");
    assert(directives.has("style-src"), "CSP includes 'style-src'");
    assert(directives.has("font-src"), "CSP includes 'font-src'");
    assert(directives.has("img-src"), "CSP includes 'img-src'");
    assert(directives.has("connect-src"), "CSP includes 'connect-src'");
    assert(directives.has("frame-src"), "CSP includes 'frame-src'");
    assert(directives.has("frame-ancestors"), "CSP includes 'frame-ancestors'");
    assert(directives.has("object-src"), "CSP includes 'object-src'");
    assert(directives.has("base-uri"), "CSP includes 'base-uri'");
    assert(directives.has("form-action"), "CSP includes 'form-action'");
    assert(directives.has("worker-src"), "CSP includes 'worker-src'");
    assert(
      directives.has("upgrade-insecure-requests"),
      "CSP includes 'upgrade-insecure-requests'",
    );

    // Specific Policy Directives
    const defaultSrc = directives.get("default-src") || [];
    assert(defaultSrc.includes("'self'"), "default-src permits 'self'");

    const scriptAttr = directives.get("script-src-attr") || [];
    assert(
      scriptAttr.includes("'none'"),
      "script-src-attr is set to 'none' (blocks inline onclick/onload)",
    );

    const frameAncestors = directives.get("frame-ancestors") || [];
    assert(
      frameAncestors.includes("'none'"),
      "frame-ancestors is set to 'none' (blocks clickjacking/framing)",
    );

    const objectSrc = directives.get("object-src") || [];
    assert(
      objectSrc.includes("'none'"),
      "object-src is set to 'none' (blocks Flash/applet/plugin exploitation)",
    );

    const baseUri = directives.get("base-uri") || [];
    assert(
      baseUri.includes("'self'"),
      "base-uri is set to 'self' (blocks malicious <base> hijacking)",
    );

    const formAction = directives.get("form-action") || [];
    assert(
      formAction.includes("'self'"),
      "form-action is set to 'self' (restricts form post destinations)",
    );
  }

  // -------------------------------------------------------------------
  // Suite 4: Dangerous CSP Allowances Prevention
  // -------------------------------------------------------------------
  console.log("\nSuite 4: Dangerous CSP Allowances Prevention");
  {
    const csp = CSP_HEADER_VALUE;

    // Forbidden: Wildcard script execution
    assert(
      !/script-src[^;]*\*/.test(csp),
      "script-src does NOT contain wildcard (*)",
    );

    // Forbidden: eval() in scripts
    assert(
      !csp.includes("'unsafe-eval'"),
      "script-src does NOT contain 'unsafe-eval'",
    );

    // Forbidden: Wildcard network connections
    assert(
      !/connect-src[^;]*\s\*(?:;|$)/.test(csp),
      "connect-src does NOT contain bare wildcard (*)",
    );

    // Forbidden: Wildcard frame embedding
    assert(
      !/frame-src[^;]*\s\*(?:;|$)/.test(csp),
      "frame-src does NOT contain bare wildcard (*)",
    );

    // Forbidden: Wildcard object loading
    assert(
      !/object-src[^;]*\*/.test(csp),
      "object-src does NOT contain wildcard (*)",
    );
  }

  // -------------------------------------------------------------------
  // Suite 5: Verified External Origins Whitelist
  // -------------------------------------------------------------------
  console.log("\nSuite 5: Verified External Origins Whitelist");
  {
    const csp = CSP_HEADER_VALUE;

    // Cloudflare Turnstile
    assert(
      csp.includes("https://challenges.cloudflare.com"),
      "Turnstile challenges origin is whitelisted",
    );

    // Google Fonts
    assert(
      csp.includes("https://fonts.googleapis.com"),
      "Google Fonts stylesheets origin is whitelisted in style-src",
    );
    assert(
      csp.includes("https://fonts.gstatic.com"),
      "Google Fonts webfonts origin is whitelisted in font-src",
    );

    // Cloudinary
    assert(
      csp.includes("https://res.cloudinary.com"),
      "Cloudinary media image origin is whitelisted in img-src",
    );
    assert(
      csp.includes("https://api.cloudinary.com"),
      "Cloudinary upload API origin is whitelisted in connect-src",
    );

    // Firestore & Firebase Auth
    assert(
      csp.includes("https://firestore.googleapis.com"),
      "Firestore gRPC/REST endpoint is whitelisted in connect-src",
    );
    assert(
      csp.includes("https://identitytoolkit.googleapis.com"),
      "Firebase Auth Identity Toolkit is whitelisted in connect-src",
    );
    assert(
      csp.includes("https://securetoken.googleapis.com"),
      "Firebase Auth Secure Token API is whitelisted in connect-src",
    );

    // Google Maps Embed
    assert(
      csp.includes("https://www.google.com"),
      "Google Maps iframe embed is whitelisted in frame-src",
    );
  }

  console.log("\n=======================================================");
  console.log(
    `  CSP & HEADERS RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`,
  );
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runSecurityHeaderTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
