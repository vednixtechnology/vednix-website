import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Section, BackgroundGlow, Eyebrow } from "@/components/site/primitives";
import { getPublishedUpdateBySlug } from "@/lib/admin/productUpdates";
import type { ProductUpdate } from "@/lib/admin/types";

import { sanitizeHtml } from "@/lib/sanitize";

export const Route = createFileRoute("/product-updates/$slug")({
  component: ProductUpdateDetailPage,
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} | Vednix Product Updates` }],
  }),
});

function ProductUpdateDetailPage() {
  const { slug } = Route.useParams();
  const [update, setUpdate] = useState<ProductUpdate | null | undefined>(
    undefined,
  );

  useEffect(() => {
    getPublishedUpdateBySlug(slug).then(setUpdate);
  }, [slug]);

  useEffect(() => {
    if (!update) return;
    document.title = update.seoTitle || `${update.title} | Vednix Technology`;
    let meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", update.seoDescription || update.title);
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(
      "href",
      update.canonicalUrl ||
        `https://vednix.com/product-updates/${update.slug}`,
    );
  }, [update]);

  if (update === undefined) {
    return (
      <Section>
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl border border-border/60 bg-surface/40" />
      </Section>
    );
  }

  if (update === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center container-px">
        <h1 className="font-display text-3xl font-semibold">
          Update not found
        </h1>
        <Link
          to="/product-updates"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-electric"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Product Updates
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-3xl text-center">
          {update.version && <Eyebrow>{update.version}</Eyebrow>}
          <h1 className="mt-5 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            {update.title}
          </h1>
          {update.releaseDate && (
            <p className="mt-4 text-sm text-muted-foreground">
              {update.releaseDate.toDate().toLocaleDateString()}
            </p>
          )}
        </div>
      </section>
      <Section className="max-w-3xl">
        {update.coverImageUrl && (
          <img
            src={update.coverImageUrl}
            alt={update.title}
            className="mb-10 aspect-video w-full rounded-2xl object-cover"
          />
        )}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(update.content) }}
        />
        <Link
          to="/product-updates"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-electric"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Product Updates
        </Link>
      </Section>
    </>
  );
}
