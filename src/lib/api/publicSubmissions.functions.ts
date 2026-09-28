import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { extractClientIp } from "@/lib/server/context.server";
import { abuseLimiter } from "@/lib/server/rateLimiter.server";
import { verifyTurnstileToken } from "@/lib/server/turnstile.server";
import {
  save,
  saveWithEmailKey,
  saveCareerApplication,
} from "@/lib/submissions";

// -------------------------------------------------------------------------
// 1. Contact Message Submission Server Function
// -------------------------------------------------------------------------
const contactInputSchema = z.object({
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
  // Anti-abuse fields:
  honeypot: z.string().max(100).optional(),
  turnstileToken: z.string().max(2048).optional(),
});

export const submitContactForm = createServerFn({ method: "POST" })
  .validator(contactInputSchema)
  .handler(async ({ data }) => {
    const clientIp = extractClientIp();
    const normalizedEmail = data.email.toLowerCase().trim();

    // 1. Honeypot Check (Silent ignore if bot tripped honeypot)
    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.warn(
        `[AbuseProtection] Honeypot triggered on contact_messages from IP: ${clientIp}`,
      );
      return { success: true };
    }

    // 2. Turnstile Verification
    const turnstileResult = await verifyTurnstileToken({
      token: data.turnstileToken,
      remoteIp: clientIp,
    });
    if (!turnstileResult.success) {
      throw new Error(
        "Security verification failed. Please refresh the page and try again.",
      );
    }

    // 3. Rate Limiting & Email Cooldown
    const rateCheck = abuseLimiter.checkLimit({
      ip: clientIp,
      formKind: "contact_messages",
      email: normalizedEmail,
    });
    if (!rateCheck.allowed) {
      throw new Error("Please wait a moment before sending another message.");
    }

    // 4. Persistence to Firestore
    await save("contact_messages", {
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      phone: data.phone.trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      consent: true,
    });

    return { success: true };
  });

// -------------------------------------------------------------------------
// 2. Early Access Submission Server Function
// -------------------------------------------------------------------------
const earlyAccessInputSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/),
  occupation: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(60),
  consent: z.literal(true),
  honeypot: z.string().max(100).optional(),
  turnstileToken: z.string().max(2048).optional(),
});

export const submitEarlyAccessForm = createServerFn({ method: "POST" })
  .validator(earlyAccessInputSchema)
  .handler(async ({ data }) => {
    const clientIp = extractClientIp();
    const normalizedEmail = data.email.toLowerCase().trim();

    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.warn(
        `[AbuseProtection] Honeypot triggered on early_access_users from IP: ${clientIp}`,
      );
      return { success: true };
    }

    const turnstileResult = await verifyTurnstileToken({
      token: data.turnstileToken,
      remoteIp: clientIp,
    });
    if (!turnstileResult.success) {
      throw new Error(
        "Security verification failed. Please refresh the page and try again.",
      );
    }

    const rateCheck = abuseLimiter.checkLimit({
      ip: clientIp,
      formKind: "early_access_users",
      email: normalizedEmail,
    });
    if (!rateCheck.allowed) {
      throw new Error("Please wait a moment before trying again.");
    }

    await saveWithEmailKey("early_access_users", normalizedEmail, {
      fullName: data.fullName.trim(),
      email: normalizedEmail,
      phone: data.phone.trim(),
      occupation: data.occupation.trim(),
      city: data.city.trim(),
      consent: true,
    });

    return { success: true };
  });

// -------------------------------------------------------------------------
// 3. Newsletter Subscription Server Function
// -------------------------------------------------------------------------
const newsletterInputSchema = z.object({
  email: z.string().trim().email().max(160),
  source: z.string().trim().max(50).default("footer"),
  honeypot: z.string().max(100).optional(),
  turnstileToken: z.string().max(2048).optional(),
});

export const submitNewsletterForm = createServerFn({ method: "POST" })
  .validator(newsletterInputSchema)
  .handler(async ({ data }) => {
    const clientIp = extractClientIp();
    const normalizedEmail = data.email.toLowerCase().trim();

    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.warn(
        `[AbuseProtection] Honeypot triggered on newsletter_subscribers from IP: ${clientIp}`,
      );
      return { success: true };
    }

    const turnstileResult = await verifyTurnstileToken({
      token: data.turnstileToken,
      remoteIp: clientIp,
    });
    if (!turnstileResult.success) {
      throw new Error("Security verification failed. Please try again.");
    }

    const rateCheck = abuseLimiter.checkLimit({
      ip: clientIp,
      formKind: "newsletter_subscribers",
      email: normalizedEmail,
    });
    if (!rateCheck.allowed) {
      throw new Error("Please wait a moment before submitting again.");
    }

    await saveWithEmailKey("newsletter_subscribers", normalizedEmail, {
      email: normalizedEmail,
      source: data.source || "footer",
    });

    return { success: true };
  });

// -------------------------------------------------------------------------
// 4. Career Application Submission Server Function
// -------------------------------------------------------------------------
const careerInputSchema = z.object({
  position: z.string().trim().min(1).max(100),
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/),
  city: z.string().trim().min(2).max(60),
  college: z.string().trim().min(2).max(150),
  degree: z.string().trim().min(2).max(80),
  branch: z.string().trim().min(2).max(80),
  currentYear: z.string().trim().min(1).max(30),
  graduationYear: z
    .string()
    .trim()
    .regex(/^\d{4}$/),
  linkedin: z.string().trim().url().max(200).optional().or(z.literal("")),
  github: z.string().trim().url().max(200).optional().or(z.literal("")),
  portfolio: z.string().trim().url().max(200).optional().or(z.literal("")),
  resumeLink: z
    .string()
    .trim()
    .url()
    .max(500)
    .refine(
      (url) => url.startsWith("https://"),
      "Resume link must use a secure https:// URL",
    )
    .refine(
      (url) =>
        url.includes("drive.google.com") ||
        url.includes("docs.google.com") ||
        url.includes("dropbox.com") ||
        url.includes("onedrive.live.com"),
      "Resume link must be from an approved cloud storage service (Google Drive, Dropbox, OneDrive)",
    ),
  whyVednix: z.string().trim().min(50).max(1000),
  availability: z.string().trim().min(1).max(50),
  workMode: z.string().trim().min(1).max(50),
  consent: z.literal(true),
  honeypot: z.string().max(100).optional(),
  turnstileToken: z.string().max(2048).optional(),
});

export const submitCareerForm = createServerFn({ method: "POST" })
  .validator(careerInputSchema)
  .handler(async ({ data }) => {
    const clientIp = extractClientIp();
    const normalizedEmail = data.email.toLowerCase().trim();

    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.warn(
        `[AbuseProtection] Honeypot triggered on career_applications from IP: ${clientIp}`,
      );
      return { success: true };
    }

    const turnstileResult = await verifyTurnstileToken({
      token: data.turnstileToken,
      remoteIp: clientIp,
    });
    if (!turnstileResult.success) {
      throw new Error("Security verification failed. Please try again.");
    }

    const rateCheck = abuseLimiter.checkLimit({
      ip: clientIp,
      formKind: "career_applications",
      email: `${normalizedEmail}:${data.position}`,
    });
    if (!rateCheck.allowed) {
      throw new Error(
        "Please wait a moment before submitting another application.",
      );
    }

    await saveCareerApplication({
      position: data.position,
      fullName: data.fullName,
      email: normalizedEmail,
      phone: data.phone,
      city: data.city,
      college: data.college,
      degree: data.degree,
      branch: data.branch,
      currentYear: data.currentYear,
      graduationYear: data.graduationYear,
      linkedin: data.linkedin || null,
      github: data.github || null,
      portfolio: data.portfolio || null,
      resumeLink: data.resumeLink,
      whyVednix: data.whyVednix,
      availability: data.availability,
      workMode: data.workMode,
      consent: true,
    });

    return { success: true };
  });
