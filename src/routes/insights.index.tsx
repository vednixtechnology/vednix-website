import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen } from "lucide-react";
import {
  Section,
  SectionHeading,
  GlassCard,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";
import { listPublishedBlogs } from "@/lib/admin/blogs";
import type { BlogPost } from "@/lib/admin/types";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Insights — Vednix Technology" },
      {
        name: "description",
        content:
          "Thoughts on Financial Technology, Artificial Intelligence, Digital Banking, Startup Journey, and Product Innovation.",
      },
      { property: "og:title", content: "Insights — Vednix Technology" },
      {
        property: "og:description",
        content: "Insights and articles from the Vednix team.",
      },
      { property: "og:url", content: "/insights" },
    ],
    links: [{ rel: "canonical", href: "/insights" }],
  }),
  component: InsightsPage,
});

function InsightsPage() {
  const [blogs, setBlogs] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    listPublishedBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Insights</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Thoughts on the future of{" "}
            <span className="text-gradient">finance</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Financial Technology · Artificial Intelligence · Digital Banking ·
            Startup Journey · Product Innovation.
          </p>
        </div>
      </section>

      <Section>
        {blogs === null ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl border border-border/60 bg-surface/40"
              />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No articles published yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.06}>
                <Link
                  to="/insights/$slug"
                  params={{ slug: post.slug }}
                  className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition hover-lift hover:border-emerald/40"
                >
                  <div className="relative grid h-40 place-items-center overflow-hidden border-b border-border/60 bg-gradient-to-br from-surface to-background">
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <BookOpen className="h-10 w-10 text-emerald/70" />
                        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
                      </>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald">
                      {post.category}
                    </span>
                    <h2 className="mt-2 font-display text-lg font-semibold leading-snug">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-electric">
                      Read article <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
