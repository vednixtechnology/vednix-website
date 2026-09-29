import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";

/** Helper to extract client IP safely across deployment platforms (Vercel, Cloudflare, Node).
 * Runs only on the server inside .server.ts modules.
 */
export function extractClientIp(): string {
  try {
    const ip = getRequestIP();
    if (ip && ip !== "::1") return ip;
  } catch {
    // If called outside an active HTTP request context (e.g. testing)
  }
  try {
    const cfIp = getRequestHeader("cf-connecting-ip");
    if (cfIp) return cfIp.trim();
    const forwarded = getRequestHeader("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    const realIp = getRequestHeader("x-real-ip");
    if (realIp) return realIp.trim();
  } catch {
    // Ignore header lookup failure
  }
  return "127.0.0.1";
}
