import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen } from "lucide-react";
import {
  Section,
  SectionHeading,
  GlassCard,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";

export const Route = createFileRoute("/insights")({
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

const ARTICLES = [
  {
    category: "Startup Journey",
    title: "Building Vednix Technology: From Idea to Infrastructure",
    excerpt:
      "How an observation about everyday financial behaviour grew into a long-term vision to build intelligent financial infrastructure.",
  },
  {
    category: "Financial Behaviour",
    title: "Why Money Management Is Hard — and How Software Can Help",
    excerpt:
      "Digital payments are easy. Building good financial habits isn't. Here's how design and intelligent technology can change that.",
  },
  {
    category: "FinTech",
    title: "The Next Decade of Indian FinTech",
    excerpt:
      "From UPI to AI-assisted finance — a look at where intelligent financial infrastructure is heading next.",
  },
  {
    category: "Artificial Intelligence",
    title: "Designing Responsible AI for Personal Finance",
    excerpt:
      "Principles we follow as we explore AI features inside SmartPocket — privacy, transparency, and user control.",
  },
  {
    category: "Digital Banking",
    title: "What Banks Can Learn From Behaviour-First Products",
    excerpt:
      "Engagement isn't a vanity metric — it's a leading indicator of financial wellness. Lessons from a product-led approach.",
  },
  {
    category: "Product Updates",
    title: "SmartPocket Early Access: What's Next",
    excerpt:
      "A peek at the upcoming SmartPocket experience, and how early users will help shape it.",
  },
];

function InsightsPage() {
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06}>
              <article className="glass group flex h-full flex-col overflow-hidden rounded-2xl transition hover-lift hover:border-emerald/40">
                <div className="relative grid h-40 place-items-center overflow-hidden border-b border-border/60 bg-gradient-to-br from-surface to-background">
                  <BookOpen className="h-10 w-10 text-emerald/70" />
                  <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald">
                    {a.category}
                  </span>
                  <h2 className="mt-2 font-display text-lg font-semibold leading-snug">
                    {a.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {a.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-electric">
                    Coming soon <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
