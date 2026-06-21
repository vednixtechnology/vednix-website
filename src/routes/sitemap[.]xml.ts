import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://vednix.in";

interface SitemapEntry {
  path: string;
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

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
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

        const now = new Date().toISOString().split("T")[0];

        const urls = entries
          .map((e) =>
            [
              `  <url>`,
              `    <loc>${BASE_URL}${e.path}</loc>`,
              `    <lastmod>${now}</lastmod>`,
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
