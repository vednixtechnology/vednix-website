import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Rocket } from "lucide-react";
import {
  Section,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";
import { listPublishedUpdates } from "@/lib/admin/productUpdates";
import type { ProductUpdate } from "@/lib/admin/types";

export const Route = createFileRoute("/product-updates")({
  head: () => ({
    meta: [
      { title: "Product Updates — Vednix Technology" },
      {
        name: "description",
        content: "What's new in SmartPocket and the Vednix product suite.",
      },
      { property: "og:title", content: "Product Updates — Vednix Technology" },
      { property: "og:url", content: "/product-updates" },
    ],
    links: [{ rel: "canonical", href: "/product-updates" }],
  }),
  component: ProductUpdatesPage,
});

function ProductUpdatesPage() {
  const [updates, setUpdates] = useState<ProductUpdate[] | null>(null);

  useEffect(() => {
    listPublishedUpdates()
      .then(setUpdates)
      .catch(() => setUpdates([]));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Product Updates</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            What's new in <span className="text-gradient">SmartPocket</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Every release, feature, and improvement — in one place.
          </p>
        </div>
      </section>

      <Section className="max-w-3xl">
        {updates === null ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-border/60 bg-surface/40"
              />
            ))}
          </div>
        ) : updates.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No updates published yet — check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {updates.map((update, i) => (
              <Reveal key={update.id} delay={i * 0.06}>
                <Link
                  to="/product-updates/$slug"
                  params={{ slug: update.slug }}
                  className="glass group flex items-start gap-4 rounded-2xl p-6 transition hover-lift hover:border-emerald/40"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald/15 ring-1 ring-emerald/30">
                    <Rocket className="h-5 w-5 text-emerald" />
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {update.version && (
                        <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald">
                          {update.version}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {update.releaseDate?.toDate().toLocaleDateString() ??
                          ""}
                      </span>
                    </div>
                    <h2 className="mt-1.5 font-display text-lg font-semibold">
                      {update.title}
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
