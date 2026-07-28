import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Section, BackgroundGlow, Eyebrow } from "@/components/site/primitives";
import { getPublishedPressReleaseBySlug } from "@/lib/admin/pressReleases";
import type { PressRelease } from "@/lib/admin/types";

export const Route = createFileRoute("/press/$slug")({
  component: PressReleaseDetailPage,
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} | Vednix Press` }],
  }),
});

function PressReleaseDetailPage() {
  const { slug } = Route.useParams();
  const [release, setRelease] = useState<PressRelease | null | undefined>(
    undefined,
  );

  useEffect(() => {
    getPublishedPressReleaseBySlug(slug).then(setRelease);
  }, [slug]);

  useEffect(() => {
    if (!release) return;
    document.title = release.seoTitle || `${release.title} | Vednix Technology`;
    let meta = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", release.seoDescription || release.title);
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
      release.canonicalUrl || `https://vednix.com/press/${release.slug}`,
    );
  }, [release]);

  if (release === undefined) {
    return (
      <Section>
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl border border-border/60 bg-surface/40" />
      </Section>
    );
  }

  if (release === null) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center container-px">
        <h1 className="font-display text-3xl font-semibold">
          Press release not found
        </h1>
        <Link
          to="/press"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-electric"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Press
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-3xl text-center">
          <Eyebrow>Press Release</Eyebrow>
          <h1 className="mt-5 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            {release.title}
          </h1>
          {release.publishDate && (
            <p className="mt-4 text-sm text-muted-foreground">
              {release.publishDate.toDate().toLocaleDateString()}
            </p>
          )}
        </div>
      </section>
      <Section className="max-w-3xl">
        {release.coverImageUrl && (
          <img
            src={release.coverImageUrl}
            alt={release.title}
            className="mb-10 aspect-video w-full rounded-2xl object-cover"
          />
        )}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: release.content }}
        />
        <Link
          to="/press"
          className="mt-10 inline-flex items-center gap-1.5 text-sm font-semibold text-electric"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Press
        </Link>
      </Section>
    </>
  );
}
