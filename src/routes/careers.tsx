import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  Rocket,
  GraduationCap,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  Code2,
  Server,
  Megaphone,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Laptop,
  Star,
} from "lucide-react";
import {
  Section,
  SectionHeading,
  GlassCard,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Internships at Vednix Technology" },
      {
        name: "description",
        content:
          "Join Vednix Technology in building intelligent financial infrastructure. Apply for internships in Flutter, Node.js, React, Marketing, and UI/UX Design.",
      },
      { property: "og:title", content: "Careers — Vednix Technology" },
      {
        property: "og:description",
        content: "Build the future of intelligent finance with Vednix.",
      },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

const WHY = [
  {
    icon: Sparkles,
    title: "Meaningful Impact",
    desc: "Work on products that solve real financial challenges for everyday users — not just demos.",
  },
  {
    icon: Rocket,
    title: "Startup Velocity",
    desc: "Move fast, ship real features, and see your work in production from day one.",
  },
  {
    icon: GraduationCap,
    title: "Mentorship & Growth",
    desc: "Work closely with founders and mentors from IIT Indore and IIST Indore.",
  },
  {
    icon: ShieldCheck,
    title: "Real Ownership",
    desc: "Own a feature, a module, or even a full product surface — not just ticket tasks.",
  },
  {
    icon: Lightbulb,
    title: "Innovation Culture",
    desc: "We encourage new ideas, experiment boldly, and welcome every team member's perspective.",
  },
  {
    icon: TrendingUp,
    title: "Career Acceleration",
    desc: "Build a portfolio that stands out — fintech, AI, and enterprise-grade product experience.",
  },
];

const INTERNSHIPS = [
  {
    icon: Code2,
    title: "Flutter Developer Intern",
    badge: "Engineering",
    badgeColor: "emerald",
    overview:
      "Build the SmartPocket mobile application using Flutter — handling UI, state management, API integration, and Firebase connectivity across Android and iOS.",
    responsibilities: [
      "Develop and maintain Flutter UI components for SmartPocket",
      "Integrate REST APIs and Firebase services",
      "Collaborate with the product team on feature development",
      "Ensure responsive layouts and smooth animations",
      "Write clean, well-documented Dart code",
    ],
    requirements: [
      "Flutter & Dart fundamentals",
      "Understanding of REST APIs",
      "Firebase basics (Firestore / Auth)",
      "Git version control",
    ],
    preferred: [
      "State management (Riverpod/Bloc)",
      "Material 3 design",
      "Previous app project",
    ],
    duration: "2–6 months",
    mode: "Remote / Hybrid",
  },
  {
    icon: Server,
    title: "Node.js Backend Intern",
    badge: "Engineering",
    badgeColor: "emerald",
    overview:
      "Support backend development for Vednix's financial infrastructure — building APIs, data models, integrations, and scalable architecture patterns.",
    responsibilities: [
      "Build and maintain RESTful APIs using Node.js and Express",
      "Design Firestore data models and query logic",
      "Implement authentication, input validation, and error handling",
      "Collaborate with frontend teams on API contracts",
      "Write unit tests and maintain documentation",
    ],
    requirements: [
      "Node.js & Express.js",
      "REST API design principles",
      "PostgreSQL or Firestore basics",
      "Git & basic CI/CD awareness",
    ],
    preferred: [
      "TypeScript",
      "Firebase Admin SDK",
      "API security best practices",
    ],
    duration: "2–6 months",
    mode: "Remote / Hybrid",
  },
  {
    icon: Megaphone,
    title: "Marketing & Growth Intern",
    badge: "Growth",
    badgeColor: "electric",
    overview:
      "Drive Vednix's digital presence, startup branding, and early community building — creating compelling content and building meaningful partnerships.",
    responsibilities: [
      "Plan and execute social media content across LinkedIn, Instagram",
      "Create content that communicates Vednix's mission and product vision",
      "Support early user acquisition and community engagement",
      "Research startup ecosystems, incubators, and fintech communities",
      "Assist in preparing pitch decks, investor materials, and marketing assets",
    ],
    requirements: [
      "Strong written and verbal communication",
      "Social media content creation",
      "Research and analytical mindset",
      "Understanding of fintech or startup space",
    ],
    preferred: ["Canva / design tools", "LinkedIn strategy", "Email marketing"],
    duration: "2–4 months",
    mode: "Remote",
  },
];

const SELECTION_PROCESS = [
  {
    step: "01",
    title: "Apply Online",
    desc: "Fill the application form with your details and motivation.",
  },
  {
    step: "02",
    title: "Application Review",
    desc: "Our team carefully reviews every submission within 7–10 business days.",
  },
  {
    step: "03",
    title: "Shortlisting",
    desc: "Shortlisted candidates receive an email to schedule an interview.",
  },
  {
    step: "04",
    title: "Interview",
    desc: "A short conversation to understand your interests, skills, and fit.",
  },
  {
    step: "05",
    title: "Offer & Onboarding",
    desc: "Selected interns receive an offer and begin their Vednix journey.",
  },
];

function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Careers · Internships</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Build the future <span className="text-gradient">with Vednix</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We're a small team with a big mission. Join us as we build
            intelligent financial infrastructure from the ground up. Real work.
            Real ownership. Real impact.
          </p>
        </div>
      </section>

      {/* WHY VEDNIX */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Why work with us"
            title="A place to grow, build, and ship."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.05}>
              <GlassCard className="h-full">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-emerald">
                  <w.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {w.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* OPEN POSITIONS */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Open Positions"
            title="We're hiring interns."
            align="center"
          />
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            All positions are unpaid internships with a certificate of
            completion. Exceptional interns may receive pre-placement
            opportunities as Vednix grows.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8">
          {INTERNSHIPS.map((job, i) => (
            <Reveal key={job.title} delay={i * 0.06}>
              <div className="glass rounded-2xl overflow-hidden transition hover:border-emerald/30">
                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-border/60 p-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                        job.badgeColor === "emerald"
                          ? "bg-emerald/15 ring-1 ring-emerald/30"
                          : "bg-electric/15 ring-1 ring-electric/30"
                      }`}
                    >
                      <job.icon
                        className={`h-6 w-6 ${job.badgeColor === "emerald" ? "text-emerald" : "text-electric"}`}
                      />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl font-semibold">
                          {job.title}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            job.badgeColor === "emerald"
                              ? "bg-emerald/15 text-emerald"
                              : "bg-electric/15 text-electric"
                          }`}
                        >
                          {job.badge}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {job.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {job.mode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> Internship
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/career-apply"
                    search={{ position: job.title }}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-emerald transition hover:opacity-90"
                  >
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {/* Body */}
                <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Overview */}
                  <div className="sm:col-span-2 lg:col-span-4">
                    <p className="text-sm text-muted-foreground">
                      {job.overview}
                    </p>
                  </div>

                  {/* Responsibilities */}
                  <div className="sm:col-span-2">
                    <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <BookOpen className="h-3.5 w-3.5 text-emerald" />{" "}
                      Responsibilities
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {job.responsibilities.map((r) => (
                        <li
                          key={r}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Requirements & Preferred */}
                  <div>
                    <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <Laptop className="h-3.5 w-3.5 text-emerald" />{" "}
                      Requirements
                    </h4>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.requirements.map((r) => (
                        <span
                          key={r}
                          className="rounded-md border border-border bg-card/60 px-2 py-1 text-[11px] font-medium text-muted-foreground"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      <Star className="h-3.5 w-3.5 text-electric" /> Preferred
                    </h4>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.preferred.map((r) => (
                        <span
                          key={r}
                          className="rounded-md border border-electric/20 bg-electric/10 px-2 py-1 text-[11px] font-medium text-electric/80"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* SELECTION PROCESS */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Selection process."
            description="We keep our hiring process simple, transparent, and respectful of your time."
            align="center"
          />
        </Reveal>
        <div className="relative mt-12">
          <div className="absolute left-1/2 top-5 hidden h-full w-px -translate-x-1/2 bg-border/60 lg:block" />
          <div className="grid gap-6 lg:gap-8">
            {SELECTION_PROCESS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.06}>
                <div
                  className={`relative flex flex-col gap-4 lg:flex-row lg:items-start ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`lg:w-[calc(50%-2rem)] ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}
                  >
                    <GlassCard>
                      <div
                        className={`flex items-start gap-4 ${i % 2 !== 0 ? "lg:flex-row-reverse lg:text-right" : ""}`}
                      >
                        <span className="font-display text-4xl font-bold text-gradient opacity-40">
                          {s.step}
                        </span>
                        <div>
                          <h3 className="font-display text-lg font-semibold">
                            {s.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                  <div className="hidden lg:flex lg:w-16 lg:shrink-0 lg:items-start lg:justify-center lg:pt-6">
                    <div className="z-10 grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-xs font-bold text-emerald shadow-emerald">
                      {i + 1}
                    </div>
                  </div>
                  <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
            <div className="pointer-events-none absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-electric/20 blur-[120px]" />
            <div className="relative">
              <Eyebrow>Ready to apply?</Eyebrow>
              <h2 className="mt-5 mx-auto max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
                Don't see a perfect fit? Apply anyway.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                We're always open to hearing from talented, motivated
                individuals. If you believe in Vednix's mission, reach out —
                we'd love to talk.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/career-apply"
                  search={{ position: "" }}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-primary px-6 text-base font-semibold text-primary-foreground shadow-emerald transition hover:opacity-90"
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-card/40 px-6 text-base font-semibold transition hover:bg-card hover:border-emerald/50"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
