import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import type { Timestamp } from "firebase/firestore";
import { listPublishedBlogs } from "@/lib/admin/blogs";
import { listPublishedPressReleases } from "@/lib/admin/pressReleases";
import { listPublishedUpdates } from "@/lib/admin/productUpdates";

const BASE_URL = "https://vednixtech.in";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: string;
}

function toDateString(ts: Timestamp | null, fallback: string): string {
  return ts ? ts.toDate().toISOString().split("T")[0] : fallback;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString().split("T")[0];

        const staticBase: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/products", changefreq: "monthly", priority: "0.8" },
          { path: "/smartpocket", changefreq: "weekly", priority: "0.9" },
          { path: "/solutions", changefreq: "monthly", priority: "0.8" },
          { path: "/for-banks", changefreq: "monthly", priority: "0.7" },
          { path: "/early-access", changefreq: "weekly", priority: "0.9" },
          { path: "/careers", changefreq: "weekly", priority: "0.7" },
          { path: "/career-apply", changefreq: "monthly", priority: "0.5" },
          { path: "/insights", changefreq: "weekly", priority: "0.6" },
          { path: "/product-updates", changefreq: "weekly", priority: "0.6" },
          { path: "/press", changefreq: "weekly", priority: "0.6" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          {
            path: "/investor-relations",
            changefreq: "monthly",
            priority: "0.6",
          },
          { path: "/trust-center", changefreq: "monthly", priority: "0.6" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          { path: "/cookies", changefreq: "yearly", priority: "0.3" },
          { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
        ];
        const staticEntries: SitemapEntry[] = staticBase.map((e) => ({
          ...e,
          lastmod: now,
        }));

        // Pull in everything actually published in the CMS so new blog
        // posts, press releases, and product updates get indexed without
        // needing a manual sitemap edit every time.
        const [blogs, pressReleases, updates] = await Promise.all([
          listPublishedBlogs().catch(() => []),
          listPublishedPressReleases().catch(() => []),
          listPublishedUpdates().catch(() => []),
        ]);

        const dynamicEntries: SitemapEntry[] = [
          ...blogs.map((b) => ({
            path: `/insights/${b.slug}`,
            lastmod: toDateString(b.updatedAt ?? b.publishDate, now),
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
          ...pressReleases.map((p) => ({
            path: `/press/${p.slug}`,
            lastmod: toDateString(p.updatedAt ?? p.publishDate, now),
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
          ...updates.map((u) => ({
            path: `/product-updates/${u.slug}`,
            lastmod: toDateString(u.updatedAt ?? u.releaseDate, now),
            changefreq: "monthly" as const,
            priority: "0.5",
          })),
        ];

        const entries = [...staticEntries, ...dynamicEntries];

        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              `    <lastmod>${e.lastmod ?? now}</lastmod>`,
              e.changefreq
                ? `    <changefreq>${e.changefreq}</changefreq>`
                : null,
              e.priority ? `    <priority>${e.priority}</priority>` : null,
              `  </url>`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n");

        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
