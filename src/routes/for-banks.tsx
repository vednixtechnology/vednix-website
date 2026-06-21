import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Brain,
  Users,
  MessageSquare,
  Bot,
  Database,
  Lock,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Layers,
  Globe,
  Zap,
  TrendingUp,
  CheckCircle2,
  Mail,
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

export const Route = createFileRoute("/for-banks")({
  head: () => ({
    meta: [
      { title: "For Banks — Future Financial Infrastructure | Vednix Technology" },
      {
        name: "description",
        content:
          "Vednix Technology aims to collaborate with financial institutions to build intelligent financial experiences, behaviour-driven insights, AI analytics, and future-ready digital ecosystems. Explore our vision for banking infrastructure.",
      },
      { property: "og:title", content: "For Banks — Vednix Technology" },
      { property: "og:description", content: "Future financial infrastructure for banking innovation." },
      { property: "og:url", content: "/for-banks" },
    ],
    links: [{ rel: "canonical", href: "/for-banks" }],
  }),
  component: ForBanksPage,
});

const VISION_PILLARS = [
  {
    icon: Brain,
    title: "Behavioural Intelligence",
    desc: "AI-powered analysis of financial behaviour patterns to deliver personalized, context-aware customer experiences that traditional analytics cannot provide.",
  },
  {
    icon: BarChart3,
    title: "Financial Analytics",
    desc: "Deep insights into customer spending patterns, saving behaviour, and financial decision-making — helping institutions serve customers more effectively.",
  },
  {
    icon: Users,
    title: "Customer Engagement",
    desc: "Next-generation digital touchpoints that improve customer retention, satisfaction, and long-term financial wellness — beyond basic banking transactions.",
  },
  {
    icon: Bot,
    title: "AI-Assisted Finance",
    desc: "Intelligent assistants and recommendation engines that guide customers toward better financial decisions while reducing support burden for institutions.",
  },
  {
    icon: Database,
    title: "Financial Data Infrastructure",
    desc: "Scalable data pipelines and storage architectures designed for the volume, velocity, and sensitivity of modern financial data.",
  },
  {
    icon: Smartphone,
    title: "Digital Banking Experience",
    desc: "Modern, intuitive digital experiences that meet customers where they are — mobile-first, accessible, and behaviour-aware.",
  },
  {
    icon: Lock,
    title: "Security & Compliance",
    desc: "Every system we build is designed with security-first principles, data privacy, and regulatory compliance as non-negotiable foundations.",
  },
  {
    icon: MessageSquare,
    title: "Customer Communication",
    desc: "Intelligent communication systems that deliver the right message, to the right customer, at the right financial moment.",
  },
];

const INFRASTRUCTURE_PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Security First",
    desc: "Every integration, data flow, and API is designed with bank-grade security principles from the ground up — not bolted on afterward.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    desc: "Build what you need. Our future platform is designed to integrate modularly with existing banking infrastructure — no full replacements required.",
  },
  {
    icon: Globe,
    title: "Compliance Mindset",
    desc: "We approach every product with regulatory awareness. Our solutions are designed with RBI guidelines and data localisation requirements in mind.",
  },
  {
    icon: Zap,
    title: "Scalable by Design",
    desc: "Infrastructure built to handle the transaction volume, data load, and concurrent users that financial institutions demand — from day one.",
  },
];

const COLLABORATION_TYPES = [
  {
    title: "Technology Partnership",
    desc: "Partner with Vednix to integrate our behavioural intelligence layer into your existing digital banking infrastructure.",
    items: ["API integration planning", "Pilot programs", "Technical collaboration"],
  },
  {
    title: "Innovation Collaboration",
    desc: "Work with our team on co-developing next-generation financial products that serve your customer base.",
    items: ["Joint product development", "Research collaboration", "Pilot user testing"],
  },
  {
    title: "Investment & Advisory",
    desc: "Institutions interested in being part of the Vednix growth journey — through investment, advisory, or strategic support.",
    items: ["Strategic investment discussion", "Advisory board participation", "Mentorship partnership"],
  },
];

function ForBanksPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>For Banks · Future Vision</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Building intelligent infrastructure for{" "}
            <span className="text-gradient">the future of banking</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Vednix Technology envisions a future where financial institutions use behavioural
            intelligence, AI analytics, and user-centric digital infrastructure to serve customers
            more meaningfully. We are actively researching this space.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-card/40 px-4 py-2 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" />
            These are research and vision areas — not current production offerings
          </div>
        </div>
      </section>

      {/* VISION PILLARS */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Future Areas"
            title="Where Vednix could partner with financial institutions."
            description="A set of research-driven concepts we are developing to eventually offer as enterprise-grade solutions for banking and financial services."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VISION_PILLARS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.04}>
              <GlassCard className="h-full group">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary/15 ring-1 ring-emerald/30 transition group-hover:bg-gradient-primary group-hover:shadow-emerald">
                  <a.icon className="h-5 w-5 text-emerald transition group-hover:text-primary-foreground" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* INFRASTRUCTURE PRINCIPLES */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Our Principles"
            title="How we think about financial infrastructure."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {INFRASTRUCTURE_PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
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

      {/* COLLABORATION */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Partnership Types"
            title="Ways to collaborate with Vednix."
            description="Whether you're a bank, NBFC, cooperative institution, or fintech player — we welcome conversations about how we can build together."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {COLLABORATION_TYPES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <GlassCard className="h-full flex flex-col">
                <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                <ul className="mt-4 space-y-2 flex-1">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald" />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* DISCLAIMER */}
      <Section>
        <Reveal>
          <div className="glass rounded-2xl border-dashed border-border p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Important Disclosure
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Vednix Technology is a registered startup currently in the product development phase.
              The banking and institutional solutions described on this page represent our research
              vision and future roadmap — they are not current production offerings. We do not claim
              any existing partnerships with banks, NBFCs, or financial institutions unless explicitly
              stated. Any collaboration discussions are subject to mutual agreement and due diligence.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section>
        <div className="glass-strong relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-electric/15 blur-[120px]" />
          <div className="relative">
            <Eyebrow>Request Partnership</Eyebrow>
            <h2 className="mt-5 mx-auto max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
              Interested in exploring future collaboration?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              We welcome early discussions with financial institutions, fintech organizations, NBFCs,
              and innovation partners who share our vision for the future of intelligent banking.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LinkButton to="/contact">
                Request a Partnership Discussion <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <a
                href="mailto:vednixtechnology@gmail.com"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-card/40 px-6 text-base font-semibold transition hover:bg-card hover:border-emerald/50"
              >
                <Mail className="h-4 w-4" /> Email Us Directly
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
