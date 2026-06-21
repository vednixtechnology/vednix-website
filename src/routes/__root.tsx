import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageTransition } from "@/components/site/PageTransition";
import { BackToTop } from "@/components/site/BackToTop";
import { CookieConsent } from "@/components/site/CookieConsent";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center container-px section-py">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-primary" />
          <p className="font-display text-[10rem] leading-none font-bold text-gradient">404</p>
          <h1 className="mt-4 font-display text-3xl font-semibold">Page Not Found</h1>
          <p className="mt-3 text-muted-foreground">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground shadow-emerald transition hover:opacity-90"
            >
              Go Home
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card/40 px-6 text-sm font-semibold text-foreground transition hover:bg-card"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center container-px">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We hit an unexpected error. You can try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-semibold"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#050816" },
      { title: "Vednix Technology — Building Intelligent Financial Infrastructure" },
      {
        name: "description",
        content:
          "Vednix Technology is a fintech company building intelligent financial infrastructure powered by AI and behavioural innovation. SmartPocket is our flagship product.",
      },
      { name: "author", content: "Vednix Technology" },
      { property: "og:site_name", content: "Vednix Technology" },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Vednix Technology — Building Intelligent Financial Infrastructure",
      },
      {
        property: "og:description",
        content:
          "Building the next generation of intelligent financial infrastructure for individuals, businesses, and institutions.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Vednix Technology — Building Intelligent Financial Infrastructure",
      },
      {
        name: "twitter:description",
        content: "Building Intelligent Financial Infrastructure.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4a1a28b2-b950-44af-81c1-16dc19cbc7f8/id-preview-f2e0403f--ee846189-c04d-4d38-ab66-9ad1dc7f28a4.lovable.app-1781658337875.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4a1a28b2-b950-44af-81c1-16dc19cbc7f8/id-preview-f2e0403f--ee846189-c04d-4d38-ab66-9ad1dc7f28a4.lovable.app-1781658337875.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,400&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Vednix Technology",
          legalName: "Vednix Technology Private Limited",
          url: "https://vednix.in",
          email: "vednixtechnology@gmail.com",
          telephone: ["+91-9039462506", "+91-9131060960"],
          foundingDate: "2026-02",
          description:
            "Vednix Technology is building intelligent financial infrastructure through AI and behavioural innovation. SmartPocket is our flagship product.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "187 Dudhia",
            addressLocality: "Indore",
            addressRegion: "Madhya Pradesh",
            postalCode: "452001",
            addressCountry: "IN",
          },
          sameAs: [
            "https://www.linkedin.com/company/vednix-technology/",
            "https://www.instagram.com/vednix_technology_pvt_ltd",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function ScrollToTop() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      <div className="flex min-h-dvh flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
        <Footer />
        <BackToTop />
        <CookieConsent />
      </div>
    </QueryClientProvider>
  );
}
