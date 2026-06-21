import { createFileRoute, Link } from "@tanstack/react-router";
import {
  User,
  Briefcase,
  GraduationCap,
  Landmark,
  Globe,
  Code2,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Brain,
  BarChart3,
  Smartphone,
  Building2,
  Lock,
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

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Solutions — Vednix Technology" },
      {
        name: "description",
        content:
          "Vednix Technology builds financial solutions for individuals, businesses, educational institutions, financial institutions, and government. Explore how we solve financial challenges.",
      },
      { property: "og:title", content: "Solutions — Vednix Technology" },
      { property: "og:description", content: "Intelligent financial solutions for every kind of customer." },
      { property: "og:url", content: "/solutions" },
    ],
    links: [{ rel: "canonical", href: "/solutions" }],
  }),
  component: SolutionsPage,
});

const SOLUTIONS = [
  {
    icon: User,
    segment: "Individuals",
    eyebrow: "Personal Finance",
    color: "emerald",
    problem:
      "Most people lack the tools to understand their spending, build savings habits, or make informed financial decisions — leading to financial stress and poor long-term outcomes.",
    solution:
      "SmartPocket gives individuals an intelligent, private, and intuitive way to track expenses, understand financial patterns, and make smarter money decisions through AI-driven insights.",
    benefits: [
      "Automatic expense categorization",
      "Spending pattern analysis",
      "Budget planning tools",
      "AI-powered financial insights",
      "Private and secure by design",
    ],
    cta: "/smartpocket",
    ctaLabel: "Explore SmartPocket",
  },
  {
    icon: Briefcase,
    segment: "Businesses",
    eyebrow: "Business Finance",
    color: "electric",
    problem:
      "Small and medium businesses struggle with fragmented financial data, manual reporting, and limited visibility into cash flow — making growth decisions harder than they need to be.",
    solution:
      "Future Vednix business solutions will provide intelligent financial dashboards, cash flow analytics, and financial reporting tools tailored for growing businesses.",
    benefits: [
      "Business expense management",
      "Cash flow visibility",
      "Financial reporting tools",
      "AI-assisted decision making",
      "Scalable as you grow",
    ],
    cta: "/contact",
    ctaLabel: "Discuss Your Needs",
    future: true,
  },
  {
    icon: GraduationCap,
    segment: "Educational Institutions",
    eyebrow: "EdFinTech",
    color: "emerald",
    problem:
      "Students and institutions lack structured tools for financial literacy, scholarship tracking, and campus payment management — limiting financial awareness at a critical life stage.",
    solution:
      "Vednix is researching how to bring financial literacy tools, campus fintech integrations, and student financial wellness features to educational environments.",
    benefits: [
      "Financial literacy modules",
      "Student expense tracking",
      "Campus financial tools",
      "Institutional reporting",
      "Financial wellness programs",
    ],
    cta: "/contact",
    ctaLabel: "Partner With Us",
    future: true,
  },
  {
    icon: Landmark,
    segment: "Financial Institutions",
    eyebrow: "Banking & Finance",
    color: "electric",
    problem:
      "Banks and financial institutions need intelligent behavioural data, digital engagement tools, and modern infrastructure to serve the next generation of financially aware customers.",
    solution:
      "Vednix Technology aims to partner with financial institutions to build behaviour-driven insights, customer engagement platforms, and intelligent financial data infrastructure.",
    benefits: [
      "Behavioral analytics layer",
      "Customer engagement solutions",
      "Digital experience tools",
      "AI-driven financial intelligence",
      "Future API integrations",
    ],
    cta: "/for-banks",
    ctaLabel: "Banking Solutions",
  },
  {
    icon: Globe,
    segment: "Government & Public Sector",
    eyebrow: "Public Finance",
    color: "emerald",
    problem:
      "Millions of citizens remain underserved by financial systems due to digital literacy gaps, limited access, and poor financial awareness — widening the financial inclusion gap.",
    solution:
      "Vednix's long-term vision includes contributing to financial inclusion initiatives, government fintech programs, and public sector digital finance infrastructure.",
    benefits: [
      "Financial inclusion tools",
      "Multilingual accessibility",
      "Rural and tier-2/3 reach",
      "Government program integration",
      "Digital financial literacy",
    ],
    cta: "/contact",
    ctaLabel: "Explore Collaboration",
    future: true,
  },
  {
    icon: Code2,
    segment: "Developer Platform",
    eyebrow: "Future APIs",
    color: "electric",
    problem:
      "Developers building fintech applications lack affordable, developer-friendly APIs for financial data aggregation, behavioral analytics, and AI financial intelligence.",
    solution:
      "Vednix plans to launch a future developer API platform that enables builders to integrate intelligent financial data, analytics, and AI capabilities into their own products.",
    benefits: [
      "Financial data APIs",
      "Behavioral analytics endpoints",
      "AI insight generation",
      "Developer-friendly SDK",
      "Usage-based pricing",
    ],
    cta: "/contact",
    ctaLabel: "Register Interest",
    future: true,
  },
];

const colorMap = {
  emerald: {
    icon: "bg-emerald/15 ring-1 ring-emerald/30",
    iconText: "text-emerald",
    badge: "bg-emerald/15 text-emerald",
    check: "text-emerald",
    checkBg: "bg-emerald/10",
    border: "hover:border-emerald/30",
  },
  electric: {
    icon: "bg-electric/15 ring-1 ring-electric/30",
    iconText: "text-electric",
    badge: "bg-electric/15 text-electric",
    check: "text-electric",
    checkBg: "bg-electric/10",
    border: "hover:border-electric/30",
  },
};

function SolutionsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Solutions</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Built for <span className="text-gradient">every kind</span> of customer.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Vednix Technology is building intelligent financial solutions for individuals,
            businesses, institutions, and future partners — each addressing a real, meaningful
            financial challenge.
          </p>
        </div>
      </section>

      {/* SOLUTIONS GRID */}
      <Section>
        <div className="grid gap-8">
          {SOLUTIONS.map((s, i) => {
            const colors = colorMap[s.color as keyof typeof colorMap];
            return (
              <Reveal key={s.segment} delay={i * 0.04}>
                <div
                  className={`glass rounded-2xl overflow-hidden transition ${colors.border}`}
                >
                  <div className="grid gap-0 lg:grid-cols-[1fr_1px_1fr]">
                    {/* Left */}
                    <div className="p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${colors.icon}`}>
                            <s.icon className={`h-6 w-6 ${colors.iconText}`} />
                          </span>
                          <div>
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${colors.badge}`}>
                              {s.eyebrow}
                            </span>
                            <h2 className="mt-2 font-display text-2xl font-bold">{s.segment}</h2>
                          </div>
                        </div>
                        {s.future && (
                          <span className="shrink-0 rounded-full border border-dashed border-border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Future
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">The Problem</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.problem}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Our Approach</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.solution}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden bg-border/60 lg:block" />

                    {/* Right */}
                    <div className="border-t border-border/60 p-6 sm:p-8 lg:border-t-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Key Benefits
                      </p>
                      <ul className="mt-4 space-y-2.5">
                        {s.benefits.map((b) => (
                          <li key={b} className="flex items-center gap-2.5 text-sm">
                            <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${colors.checkBg}`}>
                              <CheckCircle2 className={`h-3 w-3 ${colors.check}`} />
                            </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6">
                        <Link
                          to={s.cta}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition hover:gap-3"
                        >
                          {s.ctaLabel} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Why Vednix */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Our Approach"
            title="Why financial behaviour matters."
            description="Most financial products focus on transactions. Vednix focuses on behaviour — the patterns, habits, and decisions that determine long-term financial outcomes."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Brain, title: "Behaviour-First", desc: "We study how people interact with money — not just what they spend." },
            { icon: BarChart3, title: "Data Intelligence", desc: "Financial insights that go beyond numbers to reveal patterns and opportunities." },
            { icon: ShieldCheck, title: "Privacy by Design", desc: "Every product is built with security and user privacy as non-negotiable principles." },
            { icon: TrendingUp, title: "Long-Term Value", desc: "Products designed to create lasting change, not just short-term engagement." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <GlassCard className="h-full text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary shadow-emerald">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="glass-strong rounded-3xl px-8 py-14 text-center sm:py-20">
          <Eyebrow>Work with Vednix</Eyebrow>
          <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">
            Looking for something specific?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us about your needs — we'd love to explore how Vednix Technology can help you
            solve your financial challenges.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton to="/contact">Contact Us</LinkButton>
            <LinkButton to="/for-banks" variant="outline">
              For Banks <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
