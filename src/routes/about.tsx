import { createFileRoute } from "@tanstack/react-router";
import {
  Lightbulb,
  ShieldCheck,
  Users,
  Sparkles,
  HandshakeIcon,
  Target,
  Linkedin,
  GraduationCap,
  Landmark,
  Rocket,
  Brain,
  Layers,
  Lock,
  Heart,
  Eye,
  ArrowRight,
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

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Vednix Technology" },
      {
        name: "description",
        content:
          "Building intelligent financial infrastructure through innovation, AI, and user-centric financial technology. Learn about our story, mission, founders and mentors.",
      },
      { property: "og:title", content: "About — Vednix Technology" },
      {
        property: "og:description",
        content: "Our story, mission, and the people behind Vednix Technology.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We continuously build practical technology that solves meaningful financial problems.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    desc: "Security, transparency, and reliability are the foundation of everything we create.",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Every product begins with understanding real user needs.",
  },
  {
    icon: Sparkles,
    title: "Responsible AI",
    desc: "We believe AI and technology should always empower users responsibly.",
  },
  {
    icon: HandshakeIcon,
    title: "Collaboration",
    desc: "We value partnerships, mentorship, and teamwork to achieve sustainable growth.",
  },
  {
    icon: Target,
    title: "Long-Term Impact",
    desc: "We focus on solutions that deliver lasting value rather than short-term trends.",
  },
];

const ADVISORS = [
  {
    name: "Aman Sinha Sir",
    role: "Startup Mentor",
    desc: "Provides strategic guidance, startup insights, product validation, and entrepreneurial support that has helped refine the business vision and strengthen long-term growth strategy.",
  },
  {
    name: "Puneet Duggal Sir",
    role: "Associate Professor & CAO · IIST Indore",
    desc: "Supports Vednix Technology in refining its core business idea, strengthening product vision, and improving strategic direction through academic mentorship and innovation guidance.",
  },
  {
    name: "Gaurav Sharma Sir",
    role: "Soft Skills & Career Growth Trainer · IIST Indore",
    desc: "Guides the founding team in communication, leadership, presentation skills, strategic thinking, and professional development — strengthening confidence and business communication.",
  },
];

const JOURNEY = [
  {
    date: "Feb 2026",
    title: "Vednix Technology Founded",
    desc: "Incorporated in Indore, MP.",
  },
  {
    date: "—",
    title: "Business Idea Validation",
    desc: "Refined the SmartPocket vision with mentors and users.",
  },
  {
    date: "—",
    title: "Mentorship from IIST Indore",
    desc: "Academic guidance and innovation support.",
  },
  {
    date: "—",
    title: "Incubation Support",
    desc: "IIT Indore ACE Foundation joins the journey.",
  },
  {
    date: "—",
    title: "Development of SmartPocket",
    desc: "Our flagship product begins construction.",
  },
  {
    date: "—",
    title: "Early User Program",
    desc: "Invite-only access for first cohort.",
  },
  {
    date: "Future",
    title: "Product Expansion",
    desc: "New financial products for businesses and institutions.",
  },
];

const WHY = [
  { icon: Rocket, title: "Financial Innovation" },
  { icon: Brain, title: "Artificial Intelligence" },
  { icon: Layers, title: "Scalable Architecture" },
  { icon: Lock, title: "Secure by Design" },
  { icon: Heart, title: "User-Centric Products" },
  { icon: Eye, title: "Long-Term Vision" },
];

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            About <span className="text-gradient">Vednix Technology</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Building intelligent financial infrastructure through innovation,
            AI, and user-centric financial technology.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Our Story"
              title="From observation to infrastructure."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-5 text-muted-foreground">
              <p>
                Vednix Technology was founded in February 2026 with a vision to
                solve real-world financial challenges using technology. The
                company began with a simple observation: while digital payments
                have become easy, financial behaviour and money management
                remain difficult for millions of people.
              </p>
              <p>
                Rather than building just another payment application, Vednix
                aims to create intelligent financial infrastructure that
                empowers users to make smarter financial decisions, build better
                financial habits, and access innovative financial services.
              </p>
              <p>
                SmartPocket is the company's first flagship product and
                represents the beginning of a much larger vision — to build
                technology that connects finance, artificial intelligence,
                analytics, and digital innovation into one unified ecosystem.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* VISION & MISSION */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full">
              <Eye className="h-8 w-8 text-emerald" />
              <h3 className="mt-4 font-display text-2xl font-semibold">
                Our Vision
              </h3>
              <p className="mt-3 text-muted-foreground">
                To become one of India's leading financial technology companies
                by building intelligent financial infrastructure that transforms
                the way people, businesses, and institutions interact with
                money.
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.1}>
            <GlassCard className="h-full">
              <Target className="h-8 w-8 text-electric" />
              <h3 className="mt-4 font-display text-2xl font-semibold">
                Our Mission
              </h3>
              <p className="mt-3 text-muted-foreground">
                To create secure, scalable, and user-focused financial products
                that simplify financial management, encourage responsible
                financial behaviour, and enable the future of digital finance
                through innovation and technology.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </Section>

      {/* CORE VALUES */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Core Values"
            title="What we stand for."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.05}>
              <GlassCard className="h-full">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary/10 ring-1 ring-emerald/30">
                  <v.icon className="h-5 w-5 text-emerald" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FOUNDERS */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Leadership"
            title="Meet our founders."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <FounderCard
            name="Abhishek Dogne"
            role="Director & Founder"
            desc="Abhishek Dogne founded Vednix Technology with the vision of building intelligent financial infrastructure that makes financial management simpler, smarter, and more accessible. He leads the company's product vision, strategic direction, innovation initiatives, and long-term growth while focusing on solving real-world financial challenges through technology."
          />
          <FounderCard
            name="Garvit Sharma"
            role="Director & Co-Founder"
            desc="Garvit Sharma contributes to product development, business strategy, operational planning, and technology execution. He works closely with the founding team to transform innovative ideas into scalable products while supporting the company's long-term mission of building next-generation financial solutions."
          />
        </div>
      </Section>

      {/* MENTORS */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Mentors & Advisors"
            title="Guided by experienced academicians and professionals."
            description="They support Vednix Technology in innovation, strategy, leadership, and long-term growth."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ADVISORS.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.08}>
              <GlassCard className="h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary font-display text-lg font-bold text-primary-foreground">
                  {a.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {a.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.14em] text-emerald">
                  {a.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {a.desc}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* INCUBATION */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Incubation"
            title="Ecosystem support."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              icon: GraduationCap,
              title: "IIST Indore",
              desc: "Providing academic support, innovation environment, mentorship, and entrepreneurial guidance.",
            },
            {
              icon: Landmark,
              title: "IIT Indore ACE Foundation",
              desc: "Supporting Vednix Technology through incubation, startup ecosystem access, mentoring, networking opportunities, and innovation resources.",
            },
          ].map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <GlassCard className="h-full">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary shadow-emerald">
                  <p.icon className="h-6 w-6 text-primary-foreground" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">
                  {p.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{p.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* JOURNEY */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Our Journey"
            title="Milestones along the way."
            align="center"
          />
        </Reveal>
        <div className="mx-auto mt-14 max-w-3xl">
          <ol className="relative space-y-6 border-l border-border pl-6">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.title} delay={i * 0.05}>
                <li className="relative">
                  <span className="absolute -left-[31px] top-1.5 grid h-4 w-4 place-items-center rounded-full bg-gradient-primary shadow-emerald">
                    <span className="h-1.5 w-1.5 rounded-full bg-background" />
                  </span>
                  <div className="glass rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald">
                      {j.date}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-semibold">
                      {j.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {j.desc}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* WHY VEDNIX */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Why Vednix"
            title="Built for the next decade of finance."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.04}>
              <GlassCard className="h-full">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-electric/10 ring-1 ring-electric/30">
                  <w.icon className="h-5 w-5 text-electric" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {w.title}
                </h3>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="glass-strong rounded-3xl px-8 py-14 text-center sm:py-20">
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold sm:text-4xl">
            Let's build the future of finance together.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Whether you're a student, professional, business, investor,
            institution, or banking partner — Vednix Technology is committed to
            building innovative financial solutions that create lasting impact.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton to="/smartpocket">
              Explore SmartPocket <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton to="/contact" variant="outline">
              Contact Us
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}

function FounderCard({
  name,
  role,
  desc,
}: {
  name: string;
  role: string;
  desc: string;
}) {
  return (
    <GlassCard className="h-full">
      <div className="flex items-start gap-4">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-primary font-display text-xl font-bold text-primary-foreground shadow-emerald">
          {name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold">{name}</h3>
          <p className="text-sm font-medium text-emerald">{role}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        {desc}
      </p>
      <a
        href="https://www.linkedin.com/company/vednix-technology/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:underline"
      >
        <Linkedin className="h-4 w-4" /> Connect on LinkedIn
      </a>
    </GlassCard>
  );
}
