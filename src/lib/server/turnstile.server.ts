/**
 * Cloudflare Turnstile server-side verification utility.
 * Runs strictly server-side inside TanStack Start / Nitro server functions.
 *
 * Cloudflare Turnstile token lifecycle:
 * - Tokens are single-use and expire within 300 seconds (5 minutes).
 * - Verification is performed via POST to https://challenges.cloudflare.com/turnstile/v0/siteverify
 * - Secrets must remain server-side in TURNSTILE_SECRET_KEY.
 *
 * Official Cloudflare dummy keys for testing:
 * - Pass secret: 1x00000000000000000000000000000000AA
 * - Block secret: 2x00000000000000000000000000000000AB
 * - Spent/Replayed secret: 3x00000000000000000000000000000000AA
 */

export interface TurnstileVerificationResult {
  success: boolean;
  errorCodes: string[];
  challengeTs?: string;
  hostname?: string;
  isMocked?: boolean;
}

export async function verifyTurnstileToken(params: {
  token: string | undefined | null;
  remoteIp?: string;
  overrideSecret?: string;
}): Promise<TurnstileVerificationResult> {
  const secretKey =
    params.overrideSecret ?? process.env.TURNSTILE_SECRET_KEY?.trim();

  // If Turnstile secret is not configured in environment:
  // In development / testing mode, allow requests without crashing if unconfigured,
  // but explicitly flag that verification was unconfigured.
  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      // In production, if Turnstile is required but secret is missing, log warning
      console.warn(
        "[Security] TURNSTILE_SECRET_KEY is not configured on the server. Turnstile verification skipped.",
      );
    }
    return {
      success: true,
      errorCodes: [],
      isMocked: true,
    };
  }

  // If secret key is configured, a token is mandatory
  if (
    !params.token ||
    typeof params.token !== "string" ||
    !params.token.trim()
  ) {
    return {
      success: false,
      errorCodes: ["missing-input-response"],
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", params.token.trim());
    if (params.remoteIp) {
      formData.append("remoteip", params.remoteIp.trim());
    }

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      },
    );

    if (!res.ok) {
      return {
        success: false,
        errorCodes: [`http-error-${res.status}`],
      };
    }

    const outcome = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
      challenge_ts?: string;
      hostname?: string;
    };

    return {
      success: Boolean(outcome.success),
      errorCodes: outcome["error-codes"] ?? [],
      challengeTs: outcome.challenge_ts,
      hostname: outcome.hostname,
    };
  } catch (error) {
    console.error("[Security] Turnstile verification network failure:", error);
    // Fail-closed or fail-open depends on policy; for network failure, report error code:
    return {
      success: false,
      errorCodes: ["network-verification-failed"],
    };
  }
}
