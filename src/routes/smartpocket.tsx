import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Wallet,
  Tag,
  BarChart3,
  Calendar,
  ShieldCheck,
  Bot,
  Check,
  X,
  Smartphone,
  Lock,
  Eye,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import {
  Section,
  SectionHeading,
  GlassCard,
  LinkButton,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";
import { HeroVisual } from "@/components/site/HeroVisual";

export const Route = createFileRoute("/smartpocket")({
  head: () => ({
    meta: [
      {
        title:
          "SmartPocket — AI-powered Financial Behaviour Platform | Vednix Technology",
      },
      {
        name: "description",
        content:
          "SmartPocket helps you organize money, manage expenses, build smarter habits, and gain meaningful insights through intelligent technology. The flagship product by Vednix Technology.",
      },
      { property: "og:title", content: "SmartPocket — by Vednix Technology" },
      {
        property: "og:description",
        content:
          "AI-powered financial behaviour platform. Organize money, understand spending, and build better financial habits.",
      },
      { property: "og:url", content: "/smartpocket" },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: "/smartpocket" }],
  }),
  component: SmartPocketPage,
});

const FEATURES = [
  {
    icon: Wallet,
    title: "Smart Expense Tracking",
    desc: "Automatically organize and understand your spending — without manual data entry or spreadsheets.",
  },
  {
    icon: Tag,
    title: "Intelligent Categories",
    desc: "Expenses are organized into meaningful categories so you always know where your money is going.",
  },
  {
    icon: BarChart3,
    title: "Financial Insights",
    desc: "Go beyond numbers. Understand patterns, tendencies, and opportunities in your financial behaviour.",
  },
  {
    icon: Calendar,
    title: "Budget Planning",
    desc: "Set budgets, track progress, and plan your spending with clarity and confidence.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    desc: "Bank-grade security principles from day one — your financial data stays private and protected.",
  },
  {
    icon: Bot,
    title: "AI Financial Assistant",
    desc: "Personalized, context-aware financial guidance powered by intelligent behavioural analysis.",
    future: true,
  },
];

const TRAD = [
  "Manual and time-consuming",
  "Complex spreadsheets",
  "No spending insights",
  "No financial guidance",
  "Disconnected from habits",
];
const SMART = [
  "Simple and automatic",
  "Intelligent organization",
  "Deep financial insights",
  "AI-powered guidance",
  "Behaviour-driven design",
];

const PRIVACY_POINTS = [
  {
    icon: Lock,
    title: "Encrypted Storage",
    desc: "All data encrypted in transit and at rest.",
  },
  {
    icon: Eye,
    title: "No Ad Tracking",
    desc: "We never sell or share your data with advertisers.",
  },
  {
    icon: ShieldCheck,
    title: "Minimal Collection",
    desc: "We collect only what's needed to make the product work.",
  },
  {
    icon: Smartphone,
    title: "User Control",
    desc: "You can request data deletion at any time.",
  },
];

const ROADMAP = [
  {
    phase: "Now",
    label: "Development",
    desc: "Core expense tracking, categories, and budgeting features.",
    active: true,
  },
  {
    phase: "Next",
    label: "Early Access",
    desc: "Closed beta with first user cohort — features shaped by feedback.",
    active: false,
  },
  {
    phase: "Soon",
    label: "AI Insights",
    desc: "Personalized financial insights and behaviour analysis.",
    active: false,
  },
  {
    phase: "Future",
    label: "Ecosystem",
    desc: "Business tools, institutional integrations, and developer APIs.",
    active: false,
  },
];

const FAQ = [
  {
    q: "When will SmartPocket launch?",
    a: "SmartPocket is currently in development. We're running an early access program for selected users. Sign up to get notified when we launch and to secure priority access.",
  },
  {
    q: "Is SmartPocket free to use?",
    a: "We haven't finalized our pricing model yet. Early access members will receive priority consideration for any launch offers. We're committed to making financial intelligence accessible.",
  },
  {
    q: "How does SmartPocket keep my data secure?",
    a: "SmartPocket is built on Firebase's enterprise-grade infrastructure with encryption in transit and at rest. We follow security-first design principles and never sell your data. See our Trust Center for full details.",
  },
  {
    q: "Does SmartPocket connect to my bank account?",
    a: "At launch, SmartPocket will support manual expense tracking. Bank integration features are planned for a future release. We'll never ask for your bank login credentials.",
  },
  {
    q: "What platforms will SmartPocket support?",
    a: "SmartPocket will launch on Android and iOS via a Flutter-built native app. A web version may follow based on user demand.",
  },
  {
    q: "How is SmartPocket different from existing finance apps?",
    a: "Most finance apps focus on tracking. SmartPocket focuses on behaviour — understanding the patterns behind your spending and helping you build better financial habits through intelligent insights, not just dashboards.",
  },
];

function SmartPocketPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden pt-16 md:pt-20">
        <BackgroundGlow />
        <div className="container-px relative mx-auto grid max-w-7xl items-center gap-12 pb-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Flagship Product · by Vednix Technology</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
              Meet <span className="text-gradient">SmartPocket</span>.
            </h1>
            <p className="mt-4 text-lg font-medium text-foreground/80">
              The AI-powered financial behaviour platform.
            </p>
            <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
              SmartPocket helps you organize money more effectively, understand
              spending patterns, manage savings, and make better financial
              decisions — through intelligent technology that learns from your
              behaviour, not just your transactions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton to="/early-access" size="lg">
                Join Early Access <ArrowUpRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton to="/products" size="lg" variant="outline">
                All Products <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-card/40 px-4 py-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-emerald" />
              Currently in development · Early Access opening soon
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* FEATURES */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to manage money smarter."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <GlassCard className="h-full relative">
                {f.future && (
                  <span className="absolute right-4 top-4 rounded-full border border-dashed border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Coming Soon
                  </span>
                )}
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-emerald">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* WHY SMARTPOCKET — comparison */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Why SmartPocket"
            title="A new way to think about money."
            description="Traditional finance tools were built to record transactions. SmartPocket is built to change how you relate to money."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full border-border/50">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Traditional Finance Apps
              </p>
              <ul className="mt-5 space-y-3">
                {TRAD.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-destructive/15 text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.1}>
            <GlassCard className="relative h-full overflow-hidden border-emerald/30">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald/20 blur-3xl" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald">
                SmartPocket
              </p>
              <ul className="mt-5 space-y-3">
                {SMART.map((t) => (
                  <li key={t} className="flex items-center gap-3 font-medium">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald/15 text-emerald">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </Section>

      {/* PRIVACY */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Privacy & Security"
            title="Your financial data stays yours."
            description="We handle financial data with the seriousness it deserves — security-first architecture, minimal collection, and zero advertising."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRIVACY_POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <GlassCard className="h-full text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-emerald/10 ring-1 ring-emerald/20">
                  <p.icon className="h-6 w-6 text-emerald" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-6 text-center">
            <LinkButton to="/trust-center" variant="outline">
              View Trust Center <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Reveal>
      </Section>

      {/* ROADMAP */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Product Roadmap"
            title="Where we're headed."
            description="SmartPocket is built incrementally — each phase shaped by real user feedback and validated product decisions."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map((r, i) => (
            <Reveal key={r.phase} delay={i * 0.06}>
              <div
                className={`relative rounded-2xl border p-5 transition ${
                  r.active
                    ? "border-emerald/40 bg-emerald/5 shadow-emerald"
                    : "border-border/60 bg-card/30"
                }`}
              >
                {r.active && (
                  <span className="absolute right-4 top-4 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                    r.active ? "text-emerald" : "text-muted-foreground"
                  }`}
                >
                  {r.phase}
                </span>
                <h3 className="mt-2 font-display text-base font-semibold">
                  {r.label}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Common questions."
            align="center"
          />
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border/60">
          {FAQ.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-start justify-between gap-4 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-display text-base font-semibold">
                    {item.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
                  ) : (
                    <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openFaq === i && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="glass-strong rounded-3xl px-8 py-14 text-center sm:py-20">
          <TrendingUp className="mx-auto mb-4 h-8 w-8 text-emerald" />
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Be among the first to experience SmartPocket.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Early access members get priority access, exclusive previews, and a
            direct line to help shape the product.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton to="/early-access" size="lg">
              Join Early Access <ArrowUpRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton to="/contact" size="lg" variant="outline">
              Contact Us
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
