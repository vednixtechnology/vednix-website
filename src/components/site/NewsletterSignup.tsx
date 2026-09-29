import { useState } from "react";
import { z } from "zod";
import { Loader2, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/site/primitives";
import { submitNewsletterForm } from "@/lib/api/publicSubmissions.functions";
import { HoneypotField } from "@/components/site/HoneypotField";

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address");

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setErrorMessage(
        parsed.error.issues[0]?.message ?? "Please enter a valid email address",
      );
      return;
    }

    const normalizedEmail = parsed.data.toLowerCase();
    setStatus("loading");
    try {
      await submitNewsletterForm({
        data: {
          email: normalizedEmail,
          source: "footer",
          honeypot: honeypot || undefined,
        },
      });
      setStatus("success");
      setEmail("");
      setHoneypot("");
    } catch (err: unknown) {
      if (
        (err != null &&
          typeof err === "object" &&
          "code" in err &&
          err.code === "permission-denied") ||
        (err instanceof Error && err.message.includes("permission-denied"))
      ) {
        setStatus("duplicate");
        return;
      }
      setStatus("error");
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again in a moment.";
      setErrorMessage(msg);
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-md">
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Mail className="h-5 w-5 text-emerald" />
            Stay in the loop
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Product updates, fintech insights, and Vednix news — straight to
            your inbox. No spam, unsubscribe any time.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-start"
          noValidate
        >
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle" && status !== "loading")
                  setStatus("idle");
              }}
              placeholder="you@company.com"
              aria-invalid={status === "error"}
              aria-describedby="newsletter-status"
              className="h-11 w-full rounded-xl border border-border bg-background/60 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/30"
            />
          </div>
          <HoneypotField
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
          <Button
            type="submit"
            variant="primary"
            className="h-11 shrink-0 whitespace-nowrap"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
      </div>

      <div
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className="mt-3 min-h-[1.25rem]"
      >
        {status === "success" && (
          <p className="flex items-center gap-1.5 text-sm text-emerald">
            <CheckCircle2 className="h-4 w-4" />
            You're subscribed — welcome aboard!
          </p>
        )}
        {status === "duplicate" && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald" />
            This email is already subscribed.
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
