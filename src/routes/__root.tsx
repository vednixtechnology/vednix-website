import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PageTransition } from "@/components/site/PageTransition";
import { BackToTop } from "@/components/site/BackToTop";
import { CookieConsent } from "@/components/site/CookieConsent";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_SETTINGS, getWebsiteSettings } from "@/lib/admin/settings";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center container-px section-py">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-primary" />
          <p className="font-display text-[10rem] leading-none font-bold text-gradient">
            404
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold">
            Page Not Found
          </h1>
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

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center container-px">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">
          Something went wrong
        </h1>
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: async () => {
      // Falls back to DEFAULT_SETTINGS (which mirror the original hardcoded
      // content exactly) if Firestore is unreachable, so a network hiccup
      // during SSR never breaks the page.
      const settings = await getWebsiteSettings().catch(() => ({
        ...DEFAULT_SETTINGS,
        updatedAt: null,
        updatedBy: null,
      }));
      return { settings };
    },
    head: ({ loaderData }) => {
      const s = loaderData?.settings ?? DEFAULT_SETTINGS;
      const title = s.seoDefaultTitle || DEFAULT_SETTINGS.seoDefaultTitle;
      const description =
        s.seoDefaultDescription || DEFAULT_SETTINGS.seoDefaultDescription;
      const ogImage = s.defaultOgImageUrl || DEFAULT_SETTINGS.defaultOgImageUrl;
      const favicon = s.faviconUrl || DEFAULT_SETTINGS.faviconUrl;

      return {
        meta: [
          { charSet: "utf-8" },
          { name: "viewport", content: "width=device-width, initial-scale=1" },
          { name: "theme-color", content: "#050816" },
          { title },
          { name: "description", content: description },
          { name: "author", content: s.companyName },
          { property: "og:site_name", content: s.companyName },
          { property: "og:type", content: "website" },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: title },
          { name: "twitter:description", content: description },
          { property: "og:image", content: ogImage },
          { name: "twitter:image", content: ogImage },
          ...(s.googleAnalyticsId
            ? [{ name: "google-analytics-id", content: s.googleAnalyticsId }]
            : []),
        ],
        links: [
          { rel: "stylesheet", href: appCss },
          { rel: "icon", href: favicon },
          { rel: "preconnect", href: "https://fonts.googleapis.com" },
          {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "anonymous",
          },
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
              name: s.companyName,
              legalName: `${s.companyName} Private Limited`,
              url: "https://vednixtech.in",
              email: s.contactEmail || DEFAULT_SETTINGS.contactEmail,
              telephone: [s.contactPhone, s.contactPhoneAlt].filter(Boolean),
              foundingDate: "2026-02",
              description,
              address: {
                "@type": "PostalAddress",
                streetAddress: "187 Dudhia",
                addressLocality: "Indore",
                addressRegion: "Madhya Pradesh",
                postalCode: "452001",
                addressCountry: "IN",
              },
              sameAs: [s.linkedinUrl, s.instagramUrl].filter(Boolean),
            }),
          },
        ],
      };
    },
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  },
);

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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    // The /admin CMS has its own dashboard shell (sidebar, header, login
    // screen) — none of the public site's Navbar/Footer/CookieConsent apply.
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster />
      </QueryClientProvider>
    );
  }

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
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
