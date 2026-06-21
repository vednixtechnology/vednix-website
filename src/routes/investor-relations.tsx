import { createFileRoute } from "@tanstack/react-router";
import {
  TrendingUp,
  Target,
  Globe,
  Layers,
  ArrowRight,
  Users,
  Rocket,
  Brain,
  ShieldCheck,
  BarChart3,
  Download,
  Calendar,
  Mail,
  CheckCircle2,
  Award,
  Building2,
  Landmark,
  GraduationCap,
} from "lucide-react";
import {
  Section,
  SectionHeading,
  GlassCard,
  LinkButton,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";

export const Route = createFileRoute("/investor-relations")({
  head: () => ({
    meta: [
      { title: "Investor Relations — Vednix Technology" },
      {
        name: "description",
        content:
          "Vednix Technology is building intelligent financial infrastructure for India and beyond. Learn about our vision, market opportunity, milestones, and growth strategy.",
      },
      { property: "og:title", content: "Investor Relations — Vednix Technology" },
      {
        property: "og:description",
        content: "Building intelligent financial infrastructure for the next generation.",
      },
      { property: "og:url", content: "/investor-relations" },
    ],
    links: [{ rel: "canonical", href: "/investor-relations" }],
  }),
  component: InvestorRelationsPage,
});

const MILESTONES = [
  { date: "Feb 2026", title: "Company Incorporated", desc: "Vednix Technology Private Limited registered in Indore, MP.", icon: Building2, done: true },
  { date: "2026", title: "DPIIT Recognition", desc: "Recognized under Startup India (DIPP251835) as an eligible startup.", icon: Award, done: true },
  { date: "2026", title: "MSME Registration", desc: "Registered as a Micro enterprise under UDYAM (UDYAM-MP-23-0273140).", icon: ShieldCheck, done: true },
  { date: "2026", title: "IIT Indore Incubation", desc: "Accepted into the IIT Indore ACE Foundation incubation program.", icon: Landmark, done: true },
  { date: "2026", title: "Mentorship – IIST Indore", desc: "Supported by academic mentors from IIST Indore for product and strategy development.", icon: GraduationCap, done: true },
  { date: "In Progress", title: "SmartPocket Development", desc: "Active development of the flagship financial behaviour platform.", icon: Rocket, done: false },
  { date: "Upcoming", title: "Early Access Launch", desc: "Closed early access program for first user cohort.", icon: Users, done: false },
  { date: "Future", title: "Public Launch", desc: "SmartPocket public release across Android and iOS.", icon: Globe, done: false },
];

const MARKET_POINTS = [
  "India has over 500 million internet users with rapidly growing digital financial activity",
  "UPI processed over 17 billion transactions in a single month in 2024",
  "Less than 15% of Indians actively manage personal finances with digital tools",
  "Indian fintech market projected to grow significantly through the decade",
  "First-generation internet users in Tier-2/3 cities present a largely untapped opportunity",
  "Financial literacy gap creates strong demand for intelligent, accessible financial tools",
];

const STRATEGY_PILLARS = [
  {
    icon: Target,
    title: "Consumer-First Foothold",
    desc: "Establish SmartPocket as the go-to financial behaviour app for young, digitally-native Indians — building trust, retention, and behavioural data at scale.",
  },
  {
    icon: Layers,
    title: "Product Expansion",
    desc: "Expand the Vednix product ecosystem into business finance, institutional tools, and developer APIs — each built on the foundation of the consumer platform.",
  },
  {
    icon: Brain,
    title: "Behavioural Data Moat",
    desc: "Build proprietary financial behaviour data that enables smarter AI insights, better product decisions, and long-term competitive differentiation.",
  },
  {
    icon: Globe,
    title: "Institutional Partnerships",
    desc: "Collaborate with banks, NBFCs, and financial institutions who need intelligent customer engagement and financial data infrastructure.",
  },
];

const FUNDING_VISION = [
  "Accelerate product development and mobile app launch",
  "Grow the team with full-time engineers, designers, and growth professionals",
  "Expand early user acquisition and community building",
  "Invest in infrastructure, security, and compliance",
  "Research and develop institutional partnership capabilities",
];

function InvestorRelationsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Investor Relations</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Building the future of{" "}
            <span className="text-gradient">intelligent finance</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Vednix Technology is an early-stage fintech startup building intelligent financial
            infrastructure for India. We are currently seeking strategic investors and partners who
            share our long-term vision.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-card/40 px-4 py-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" />
            Early Stage · Pre-Revenue · Actively Building
          </div>
        </div>
      </section>

      {/* COMPANY OVERVIEW */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Company Vision"
              title="What we're building and why it matters."
            />
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Vednix Technology is building intelligent financial infrastructure — starting with
              SmartPocket, a financial behaviour platform that helps individuals understand and
              improve their relationship with money through AI and behavioural intelligence.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Our long-term vision extends beyond personal finance to include business tools,
              institutional infrastructure, and developer APIs — creating a comprehensive financial
              intelligence ecosystem built on proprietary behavioural data.
            </p>
            <div className="mt-8">
              <LinkButton to="/about" variant="outline">
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Founded", value: "Feb 2026", sub: "Indore, India" },
                { label: "Structure", value: "Pvt. Ltd.", sub: "CIN: U62020MP2026PTC082279" },
                { label: "Recognition", value: "DPIIT", sub: "DIPP251835 · Startup India" },
                { label: "Incubation", value: "IIT Indore", sub: "ACE Foundation" },
              ].map((item) => (
                <GlassCard key={item.label}>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 font-display text-xl font-bold">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.sub}</p>
                </GlassCard>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* MARKET OPPORTUNITY */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Market Opportunity"
            title="The size of the problem we're solving."
            description="India is one of the fastest-growing fintech markets in the world. The gap between financial activity and financial literacy presents a massive opportunity."
          />
        </Reveal>
        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {MARKET_POINTS.map((point, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="glass flex items-start gap-3 rounded-2xl p-4 transition hover:border-emerald/30">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                <p className="text-sm text-muted-foreground">{point}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground text-center">
          Market data sourced from publicly available industry reports and RBI publications. No specific financial projections are claimed.
        </p>
      </Section>

      {/* GROWTH STRATEGY */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Growth Strategy"
            title="How we plan to build and scale."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {STRATEGY_PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="glass flex gap-5 rounded-2xl p-6 transition hover:border-emerald/30">
                <span className="mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald/10 ring-1 ring-emerald/20">
                  <p.icon className="h-6 w-6 text-emerald" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* MILESTONES */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Milestones"
            title="Where we've been, where we're going."
            align="center"
          />
        </Reveal>
        <div className="relative mt-12">
          <div className="absolute left-6 top-0 h-full w-px bg-border/60 sm:left-[2.75rem]" />
          <div className="grid gap-6">
            {MILESTONES.map((m, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="relative flex gap-5 sm:gap-8">
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-card">
                    <m.icon
                      className={`h-5 w-5 ${m.done ? "text-emerald" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="flex-1 pb-2 pt-2.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`text-xs font-bold uppercase tracking-[0.14em] ${
                          m.done ? "text-emerald" : "text-muted-foreground"
                        }`}
                      >
                        {m.date}
                      </span>
                      {m.done && (
                        <span className="rounded-full bg-emerald/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="mt-0.5 font-display text-base font-semibold">{m.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* FUNDING VISION */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Funding Vision"
              title="What we'd do with investment."
              description="We are an early-stage startup seeking our first institutional investment. We do not claim any current funding or revenue."
            />
            <ul className="mt-6 space-y-3">
              {FUNDING_VISION.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard hover={false} className="h-full flex flex-col justify-between">
              <div>
                <Eyebrow>Important Disclosure</Eyebrow>
                <h3 className="mt-4 font-display text-lg font-semibold">What we don't claim</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Vednix Technology is a pre-revenue startup currently in the product development
                  phase. We do not have any existing institutional investors, disclosed funding
                  rounds, or revenue. All figures presented on this page are based on publicly
                  available industry data and our internal planning — not audited financials.
                </p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Any investment discussion is subject to full due diligence, legal review, and
                  mutual agreement. We maintain transparency in all investor communications.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:vednixtechnology@gmail.com?subject=Investor%20Inquiry%20-%20Vednix%20Technology"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-emerald transition hover:opacity-90"
                >
                  <Mail className="h-4 w-4" /> Request Meeting
                </a>
                <button
                  disabled
                  className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-dashed border-border px-5 text-sm font-semibold text-muted-foreground"
                  title="Pitch deck coming soon"
                >
                  <Download className="h-4 w-4" /> Pitch Deck (Coming Soon)
                </button>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </Section>

      {/* CONTACT CTA */}
      <Section>
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-electric/15 blur-[120px]" />
            <div className="relative">
              <Calendar className="mx-auto mb-4 h-8 w-8 text-emerald" />
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
                Interested in learning more?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                We welcome conversations with angel investors, seed funds, incubators, accelerators,
                and strategic partners who believe in the future of intelligent financial
                infrastructure.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:vednixtechnology@gmail.com?subject=Investor%20Inquiry%20-%20Vednix%20Technology"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-primary px-6 text-base font-semibold text-primary-foreground shadow-emerald transition hover:opacity-90"
                >
                  <Mail className="h-4 w-4" /> Connect With Founders
                </a>
                <LinkButton to="/contact" variant="outline">
                  Contact Page <ArrowRight className="h-4 w-4" />
                </LinkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
