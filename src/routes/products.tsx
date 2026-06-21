import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Sparkles, Smartphone, Compass } from "lucide-react";
import {
  Section,
  SectionHeading,
  GlassCard,
  LinkButton,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Vednix Technology" },
      {
        name: "description",
        content:
          "Vednix Technology is building a growing ecosystem of intelligent financial products. SmartPocket is our flagship product with more innovations on the way.",
      },
      { property: "og:title", content: "Products — Vednix Technology" },
      { property: "og:description", content: "SmartPocket and future financial innovations from Vednix Technology." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Our Products</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            A growing ecosystem of <span className="text-gradient">financial products</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            SmartPocket is our flagship product, with more innovative solutions planned for the
            future.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* SmartPocket featured */}
          <Reveal>
            <GlassCard className="relative h-full overflow-hidden p-8">
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-emerald/20 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground">
                  <Sparkles className="h-3 w-3" /> Flagship Product
                </span>
                <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">SmartPocket</h2>
                <p className="mt-4 text-muted-foreground">
                  SmartPocket is an AI-powered financial behaviour platform designed to simplify
                  personal finance. It helps users organize money, manage expenses, build smarter
                  financial habits, and gain meaningful financial insights through an intuitive and
                  intelligent experience.
                </p>

                <PhoneMockup />

                <div className="mt-6 flex flex-wrap gap-3">
                  <LinkButton to="/smartpocket">
                    Explore Product <ArrowRight className="h-4 w-4" />
                  </LinkButton>
                  <LinkButton to="/early-access" variant="outline">
                    Join Early Access <ArrowUpRight className="h-4 w-4" />
                  </LinkButton>
                </div>
              </div>
            </GlassCard>
          </Reveal>

          {/* Future innovations */}
          <Reveal delay={0.1}>
            <GlassCard className="relative h-full overflow-hidden p-8">
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-electric/20 blur-3xl" />
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-electric/40 bg-electric/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-electric">
                  <Compass className="h-3 w-3" /> Future Vision
                </span>
                <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">Future Innovations</h2>
                <p className="mt-4 text-muted-foreground">
                  Vednix Technology is actively researching and developing future financial
                  solutions for businesses, institutions, and financial organizations. Our long-term
                  vision is to build an integrated ecosystem that combines financial intelligence,
                  analytics, AI, and digital infrastructure.
                </p>

                <RoadmapVisual />

                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-emerald">
                  More innovations are coming.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mt-8 grid place-items-center rounded-2xl border border-border/60 bg-gradient-to-b from-card to-background py-10">
      <div className="relative h-56 w-32 rounded-[1.5rem] border border-white/10 bg-background shadow-lift">
        <div className="absolute left-1/2 top-1.5 h-1 w-10 -translate-x-1/2 rounded-full bg-white/15" />
        <div className="absolute inset-2 rounded-[1.25rem] bg-gradient-to-b from-surface to-background p-2">
          <div className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary">
            <Smartphone className="h-3 w-3 text-primary-foreground" />
          </div>
          <p className="mt-2 text-[8px] uppercase tracking-widest text-muted-foreground">SmartPocket</p>
          <p className="font-display text-sm font-bold">₹ 1,24,890</p>
          <div className="mt-2 flex items-end gap-1">
            {[35, 60, 45, 80, 55, 90].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-sm bg-gradient-to-t from-emerald to-electric"
                style={{ height: `${h * 0.5}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapVisual() {
  return (
    <div className="relative mt-8 rounded-2xl border border-border/60 bg-card/40 p-6">
      <div className="grid grid-cols-4 gap-3">
        {["Now", "Next", "Soon", "Future"].map((step, i) => (
          <div key={step} className="text-center">
            <div
              className={`mx-auto h-10 w-10 rounded-xl ${
                i === 0
                  ? "bg-gradient-primary shadow-emerald"
                  : "border border-dashed border-border bg-card/40"
              } grid place-items-center`}
            >
              <span className={`font-display text-sm font-bold ${i === 0 ? "text-primary-foreground" : "text-muted-foreground"}`}>
                {i + 1}
              </span>
            </div>
            <p className={`mt-2 text-xs ${i === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              {step}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 h-1 rounded-full bg-border">
        <div className="h-full w-1/4 rounded-full bg-gradient-primary" />
      </div>
    </div>
  );
}
