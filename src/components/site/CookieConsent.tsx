import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "vednix_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so it doesn't flash on page load
    const timer = setTimeout(() => {
      try {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
          setVisible(true);
        }
      } catch {
        // sessionStorage not available (SSR)
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  function accept() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-6 left-6 z-50 max-w-sm animate-fade-in-up rounded-2xl border border-border/60 bg-background/90 p-4 shadow-card backdrop-blur-xl"
    >
      <div className="flex items-start gap-3">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
        <div className="flex-1">
          <p className="text-sm font-semibold">We use cookies</p>
          <p className="mt-1 text-xs text-muted-foreground">
            We use essential cookies to make this site work. Read our{" "}
            <Link to="/cookies" className="underline underline-offset-2 hover:text-foreground">
              Cookie Policy
            </Link>
            .
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={accept}
              className="inline-flex h-8 items-center rounded-lg bg-gradient-primary px-3 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Accept
            </button>
            <button
              onClick={dismiss}
              className="inline-flex h-8 items-center rounded-lg border border-border bg-card/40 px-3 text-xs font-semibold transition hover:bg-card"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={dismiss}
          aria-label="Close cookie notice"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted-foreground transition hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
