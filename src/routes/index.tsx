import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronDown,
  Building2,
  Landmark,
  GraduationCap,
  Sparkles,
  Brain,
  ShieldCheck,
  TrendingUp,
  Wallet,
  BarChart3,
  Users,
  CheckCircle2,
} from "lucide-react";
import {
  Section,
  SectionHeading,
  GlassCard,
  LinkButton,
  Reveal,
  Counter,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";
import { HeroVisual } from "@/components/site/HeroVisual";
import { TrustBar } from "@/components/site/TrustBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vednix Technology — Building Intelligent Financial Infrastructure" },
      {
        name: "description",
        content:
          "Vednix Technology builds intelligent financial infrastructure through AI and behavioural innovation. SmartPocket is our flagship product for personal finance management.",
      },
      { property: "og:title", content: "Vednix Technology — Intelligent Financial Infrastructure" },
      {
        property: "og:description",
        content:
          "Building intelligent financial infrastructure for individuals, businesses and institutions.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const RECOGNITIONS = [
  { label: "DPIIT Recognized", icon: Award },
  { label: "MSME Registered", icon: Building2 },
  { label: "IIT Indore ACE Foundation", icon: Landmark },
  { label: "Supported by IIST Indore", icon: GraduationCap },
];

const WHY_MATTERS = [
  {
    icon: Brain,
    title: "Financial behaviour is the root cause",
    desc: "Most financial problems aren't caused by income alone — they're caused by poor visibility into spending, lack of habits, and absence of intelligent guidance.",
  },
  {
    icon: BarChart3,
    title: "Data without context is useless",
    desc: "Bank statements show numbers. SmartPocket shows patterns, tendencies, and opportunities — turning raw data into actionable financial intelligence.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy must be non-negotiable",
    desc: "Financial data is deeply personal. Every product we build is designed with security and privacy as core requirements, not afterthoughts.",
  },
  {
    icon: TrendingUp,
    title: "Long-term impact over short-term engagement",
    desc: "We don't optimize for time-on-screen. We build products that genuinely improve financial outcomes — even when that means fewer sessions.",
  },
];

const SOLUTIONS_PREVIEW = [
  {
    icon: Wallet,
    label: "Individuals",
    desc: "Personal finance, simplified and intelligent.",
    to: "/solutions",
  },
  {
    icon: Building2,
    label: "Businesses",
    desc: "Future tools for growing businesses.",
    to: "/solutions",
  },
  {
    icon: Landmark,
    label: "Financial Institutions",
    desc: "Behaviour-driven banking infrastructure.",
    to: "/for-banks",
  },
  {
    icon: Users,
    label: "Educational Institutions",
    desc: "Financial literacy for campuses.",
    to: "/solutions",
  },
];

function HomePage() {
  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden">
        <BackgroundGlow />
        <div className="container-px relative mx-auto grid max-w-7xl items-center gap-12 pb-16 pt-16 md:pb-24 md:pt-20 lg:grid-cols-2 lg:gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Eyebrow>Vednix Technology · est. 2026</Eyebrow>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.2rem]"
            >
              Building{" "}
              <span className="text-gradient">Intelligent</span>
              <br />
              Financial Infrastructure.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Vednix Technology builds the next generation of intelligent financial
              infrastructure — empowering individuals, businesses, and institutions through
              technology, AI, and behavioural innovation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <LinkButton to="/smartpocket" size="lg">
                Explore SmartPocket <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton to="/early-access" size="lg" variant="outline">
                Join Early Access <ArrowUpRight className="h-4 w-4" />
              </LinkButton>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 grid gap-3 sm:grid-cols-2"
            >
              {RECOGNITIONS.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center gap-2.5 rounded-xl border border-border/70 bg-card/40 px-3 py-2.5 text-sm text-muted-foreground backdrop-blur"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald/10">
                    <r.icon className="h-3.5 w-3.5 text-emerald" />
                  </span>
                  {r.label}
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="relative">
            <HeroVisual />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative flex justify-center pb-10">
          <motion.a
            href="#trust"
            aria-label="Scroll to next section"
            initial={{ y: 0 }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card/40 text-muted-foreground backdrop-blur"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.a>
        </div>
      </section>

      {/* ============== TRUST BAR ============== */}
      <div id="trust">
        <TrustBar />
      </div>

      {/* ============== WHO WE ARE ============== */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Who We Are"
              title={
                <>
                  The company behind{" "}
                  <span className="text-gradient">SmartPocket</span>.
                </>
              }
              description={
                <>
                  Vednix Technology is a financial technology company focused on building
                  intelligent digital products that improve financial behaviour, simplify financial
                  management, and enable smarter financial ecosystems. Our mission is to bridge
                  technology and finance through innovative, user-centric solutions that create
                  long-term value.
                </>
              }
            />
            <div className="mt-8">
              <LinkButton to="/about" variant="outline">
                Our Story <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { k: "Founded", v: "Feb 2026", s: "Indore, India" },
                { k: "Recognition", v: "DPIIT", s: "DIPP251835" },
                { k: "Incubation", v: "IIT Indore", s: "ACE Foundation" },
                { k: "Flagship", v: "SmartPocket", s: "AI-powered finance" },
              ].map((c) => (
                <GlassCard key={c.k}>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {c.k}
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold">{c.v}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.s}</p>
                </GlassCard>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ============== WHY FINANCIAL BEHAVIOUR MATTERS ============== */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Why Financial Behaviour Matters"
            title="Most financial tools track money. We change behaviour."
            description="Understanding where your money goes is step one. Understanding why — and what to do differently — is what actually changes financial outcomes."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {WHY_MATTERS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="glass flex gap-5 rounded-2xl p-6 transition hover:border-emerald/30">
                <span className="mt-0.5 grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald/10 ring-1 ring-emerald/20">
                  <item.icon className="h-6 w-6 text-emerald" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============== SOLUTIONS PREVIEW ============== */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Solutions"
            title="Built for every kind of customer."
            description="From individual users to banks and institutions — Vednix builds financial intelligence that scales."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS_PREVIEW.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <Link
                to={s.to}
                className="glass group flex h-full flex-col rounded-2xl p-5 transition hover:border-emerald/40 hover-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary/15 ring-1 ring-emerald/20 transition group-hover:bg-gradient-primary group-hover:shadow-emerald">
                  <s.icon className="h-5 w-5 text-emerald transition group-hover:text-primary-foreground" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{s.label}</h3>
                <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-electric opacity-0 transition group-hover:opacity-100">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-6 text-center">
            <LinkButton to="/solutions" variant="outline">
              View All Solutions <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Reveal>
      </Section>

      {/* ============== MISSION & VISION ============== */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <GlassCard className="relative h-full overflow-hidden">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald/20 blur-3xl" />
              <div className="relative">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald">
                  Our Mission
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
                  To build intelligent financial infrastructure that improves how people, businesses,
                  and institutions interact with money.
                </h3>
                <ul className="mt-5 space-y-2">
                  {[
                    "Simplify financial management through intelligent design",
                    "Improve financial behaviour through AI and data",
                    "Create long-term value for users and partners",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard className="relative h-full overflow-hidden">
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-electric/20 blur-3xl" />
              <div className="relative">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-electric">
                  Our Vision
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
                  To become India's trusted financial intelligence platform — trusted by individuals,
                  businesses, and institutions alike.
                </h3>
                <ul className="mt-5 space-y-2">
                  {[
                    "A comprehensive ecosystem of intelligent financial products",
                    "Behaviour-driven data as a foundation for banking innovation",
                    "Accessible, private, and trustworthy for every user",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </Section>

      {/* ============== CTA ============== */}
      <Section>
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-electric/20 blur-[120px]" />
            <div className="relative">
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-emerald" />
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold sm:text-4xl md:text-5xl">
                Innovation starts with one step.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join us as we build the future of intelligent financial infrastructure — starting with
                SmartPocket.
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
          </div>
        </Reveal>
      </Section>
    </>
  );
}
