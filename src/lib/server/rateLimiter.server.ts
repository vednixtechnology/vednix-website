/**
 * In-memory sliding-window rate limiter and deduplication engine for public form submissions.
 * Runs strictly server-side inside TanStack Start / Nitro server functions.
 *
 * Provides:
 * 1. IP-based sliding window rate limiting (protects against automated flooding).
 * 2. Identifier-based cooldown (prevents rapid-fire repeated submissions with the same email).
 * 3. Form-specific limit isolation (an action on one form does not lock out another).
 * 4. Automatic memory cleanup (purges expired records to prevent memory growth).
 */

export interface RateLimitConfig {
  /** Maximum number of requests permitted within the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds?: number;
  reason?: "ip_limit_exceeded" | "email_cooldown_active";
}

// Default limits per public form kind:
export const FORM_RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Contact: Max 5 submissions per 10 minutes per IP
  contact_messages: { maxRequests: 5, windowMs: 10 * 60 * 1000 },
  // Career: Max 3 submissions per 15 minutes per IP (high-touch application)
  career_applications: { maxRequests: 3, windowMs: 15 * 60 * 1000 },
  // Early Access: Max 5 submissions per 10 minutes per IP
  early_access_users: { maxRequests: 5, windowMs: 10 * 60 * 1000 },
  // Newsletter: Max 5 submissions per 10 minutes per IP
  newsletter_subscribers: { maxRequests: 5, windowMs: 10 * 60 * 1000 },
};

// Cooldown windows per email to prevent rapid-fire repeated submissions:
export const EMAIL_COOLDOWNS: Record<string, number> = {
  contact_messages: 60 * 1000, // 60 seconds
  career_applications: 180 * 1000, // 3 minutes
  early_access_users: 60 * 1000, // 60 seconds
  newsletter_subscribers: 30 * 1000, // 30 seconds
};

interface WindowRecord {
  timestamps: number[];
}

interface CooldownRecord {
  lastSubmittedAt: number;
}

class InMemoryAbuseLimiter {
  private ipWindows = new Map<string, WindowRecord>();
  private emailCooldowns = new Map<string, CooldownRecord>();
  private lastCleanup = Date.now();
  private readonly cleanupIntervalMs = 5 * 60 * 1000; // Sweep every 5 minutes

  /** Checks and records a request against both IP rate limits and email cooldown. */
  public checkLimit(params: {
    ip: string;
    formKind: string;
    email?: string;
    now?: number;
  }): RateLimitResult {
    const now = params.now ?? Date.now();
    this.maybeCleanup(now);

    const config = FORM_RATE_LIMITS[params.formKind] ?? {
      maxRequests: 5,
      windowMs: 10 * 60 * 1000,
    };

    // 1. Check Email Cooldown (if email provided)
    if (params.email) {
      const normalizedEmail = params.email.toLowerCase().trim();
      const emailKey = `${params.formKind}:email:${normalizedEmail}`;
      const cooldownMs = EMAIL_COOLDOWNS[params.formKind] ?? 60 * 1000;
      const existingCooldown = this.emailCooldowns.get(emailKey);

      if (existingCooldown) {
        const elapsed = now - existingCooldown.lastSubmittedAt;
        if (elapsed < cooldownMs) {
          const retryAfterSeconds = Math.ceil((cooldownMs - elapsed) / 1000);
          return {
            allowed: false,
            remaining: 0,
            resetAt: existingCooldown.lastSubmittedAt + cooldownMs,
            retryAfterSeconds,
            reason: "email_cooldown_active",
          };
        }
      }
    }

    // 2. Check IP Sliding Window
    const normalizedIp = params.ip ? params.ip.trim() : "unknown-ip";
    const ipKey = `${params.formKind}:ip:${normalizedIp}`;
    const windowStart = now - config.windowMs;

    let record = this.ipWindows.get(ipKey);
    if (!record) {
      record = { timestamps: [] };
      this.ipWindows.set(ipKey, record);
    }

    // Retain only timestamps within the current sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= config.maxRequests) {
      const oldestInWindow = record.timestamps[0];
      const resetAt = oldestInWindow + config.windowMs;
      const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfterSeconds,
        reason: "ip_limit_exceeded",
      };
    }

    // 3. Record the allowed submission
    record.timestamps.push(now);

    if (params.email) {
      const normalizedEmail = params.email.toLowerCase().trim();
      const emailKey = `${params.formKind}:email:${normalizedEmail}`;
      this.emailCooldowns.set(emailKey, { lastSubmittedAt: now });
    }

    const remaining = config.maxRequests - record.timestamps.length;
    return {
      allowed: true,
      remaining,
      resetAt: now + config.windowMs,
    };
  }

  /** Periodic purge of stale memory entries. */
  private maybeCleanup(now: number) {
    if (now - this.lastCleanup < this.cleanupIntervalMs) return;
    this.lastCleanup = now;

    const maxRetentionMs = 30 * 60 * 1000; // 30 minutes max retention

    for (const [key, record] of this.ipWindows.entries()) {
      record.timestamps = record.timestamps.filter(
        (ts) => now - ts < maxRetentionMs,
      );
      if (record.timestamps.length === 0) {
        this.ipWindows.delete(key);
      }
    }

    for (const [key, record] of this.emailCooldowns.entries()) {
      if (now - record.lastSubmittedAt > maxRetentionMs) {
        this.emailCooldowns.delete(key);
      }
    }
  }

  /** Clears all rate limiting state (for testing isolation). */
  public resetForTesting() {
    this.ipWindows.clear();
    this.emailCooldowns.clear();
    this.lastCleanup = Date.now();
  }
}

// Global singleton across requests within the server runtime
export const abuseLimiter = new InMemoryAbuseLimiter();
