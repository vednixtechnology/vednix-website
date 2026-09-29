import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Newspaper } from "lucide-react";
import {
  Section,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";
import { listPublishedPressReleases } from "@/lib/admin/pressReleases";
import type { PressRelease } from "@/lib/admin/types";

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: [
      { title: "Press — Vednix Technology" },
      {
        name: "description",
        content: "News and announcements from Vednix Technology.",
      },
      { property: "og:title", content: "Press — Vednix Technology" },
      { property: "og:url", content: "/press" },
    ],
    links: [{ rel: "canonical", href: "/press" }],
  }),
  component: PressPage,
});

function PressPage() {
  const [releases, setReleases] = useState<PressRelease[] | null>(null);

  useEffect(() => {
    listPublishedPressReleases()
      .then(setReleases)
      .catch(() => setReleases([]));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Press</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            News from <span className="text-gradient">Vednix</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Announcements, milestones, and media coverage.
          </p>
        </div>
      </section>

      <Section className="max-w-3xl">
        {releases === null ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-border/60 bg-surface/40"
              />
            ))}
          </div>
        ) : releases.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No press releases published yet — check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {releases.map((release, i) => (
              <Reveal key={release.id} delay={i * 0.06}>
                <Link
                  to="/press/$slug"
                  params={{ slug: release.slug }}
                  className="glass group flex items-start gap-4 rounded-2xl p-6 transition hover-lift hover:border-emerald/40"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-electric/15 ring-1 ring-electric/30">
                    <Newspaper className="h-5 w-5 text-electric" />
                  </span>
                  <div className="flex-1">
                    <span className="text-xs text-muted-foreground">
                      {release.publishDate?.toDate().toLocaleDateString() ?? ""}
                    </span>
                    <h2 className="mt-1 font-display text-lg font-semibold">
                      {release.title}
                    </h2>
                  </div>
                  <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-electric opacity-0 transition group-hover:opacity-100" />
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
