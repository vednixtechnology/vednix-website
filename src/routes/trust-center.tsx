import { createFileRoute } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Globe,
  AlertCircle,
  CheckCircle2,
  FileText,
  Users,
  Zap,
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

export const Route = createFileRoute("/trust-center")({
  head: () => ({
    meta: [
      { title: "Trust Center — Vednix Technology" },
      {
        name: "description",
        content:
          "How Vednix Technology handles your data responsibly, protects your privacy, and builds products with security and compliance at their core.",
      },
      { property: "og:title", content: "Trust Center — Vednix Technology" },
      {
        property: "og:description",
        content: "Privacy, security, and responsible data handling at Vednix Technology.",
      },
      { property: "og:url", content: "/trust-center" },
    ],
    links: [{ rel: "canonical", href: "/trust-center" }],
  }),
  component: TrustCenterPage,
});

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Security First",
    color: "emerald",
    desc: "Security is a first-class principle in everything we build. We use Firebase's industry-grade cloud infrastructure with encryption in transit and at rest, access controls, and security monitoring.",
    points: [
      "Data encrypted in transit (TLS/HTTPS) and at rest",
      "Firebase Security Rules enforce strict data access control",
      "No raw passwords stored — all authentication via secure standards",
      "Regular review of data access patterns",
    ],
  },
  {
    icon: Eye,
    title: "Privacy by Design",
    color: "electric",
    desc: "We build privacy into our products from the ground up — not as an afterthought. Your personal and financial data belongs to you, and we treat it accordingly.",
    points: [
      "Minimal data collection — only what's necessary",
      "No selling or sharing of personal data with advertisers",
      "User data stored in India (Firebase Indian region where available)",
      "Clear, plain-language privacy policy",
    ],
  },
  {
    icon: Database,
    title: "Responsible Data Handling",
    color: "emerald",
    desc: "We collect only what we need, store it securely, and use it only for the purposes you've consented to. We never use your financial data to profile you for advertising.",
    points: [
      "Purpose-limited data collection",
      "No sharing with third-party advertisers",
      "Data used only to improve your product experience",
      "Retention limited to what's operationally necessary",
    ],
  },
  {
    icon: Globe,
    title: "Compliance Mindset",
    color: "electric",
    desc: "As a DPIIT-recognized startup, we approach regulatory compliance with seriousness and intent. We design with Indian data protection law and RBI guidelines in mind.",
    points: [
      "Aligned with Indian IT Act and data protection framework",
      "DPIIT recognition (DIPP251835) under Startup India",
      "Designed with future DPDP Act compliance in mind",
      "No financial activities requiring RBI licensing at this stage",
    ],
  },
];

const COMMITMENTS = [
  {
    icon: Users,
    title: "User Rights",
    desc: "You can request deletion or access to your data at any time by contacting us. We process these requests promptly.",
  },
  {
    icon: AlertCircle,
    title: "Incident Response",
    desc: "In the event of a data incident, we commit to notifying affected users promptly and transparently.",
  },
  {
    icon: FileText,
    title: "Honest Communication",
    desc: "We use plain language in our privacy policy and terms — no legal jargon designed to obscure what we do with your data.",
  },
  {
    icon: Zap,
    title: "Continuous Improvement",
    desc: "We continuously review and improve our security posture as our product evolves and as the threat landscape changes.",
  },
];

const INFRASTRUCTURE_NOTES = [
  "Firebase by Google — used for authentication, database (Firestore), and cloud hosting",
  "All Firebase data is encrypted in transit and at rest",
  "Firebase Security Rules restrict data access to authorized users only",
  "No third-party analytics that track personal behaviour without consent",
  "No advertising SDKs embedded in the product",
];

function TrustCenterPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Trust Center</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Your trust is the{" "}
            <span className="text-gradient">foundation we build on</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            We build financial products. That means we take privacy, security, and responsible data
            handling more seriously than most — because your financial life depends on it.
          </p>
        </div>
      </section>

      {/* TRUST PILLARS */}
      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          {TRUST_PILLARS.map((pillar, i) => {
            const isEmerald = pillar.color === "emerald";
            return (
              <Reveal key={pillar.title} delay={i * 0.06}>
                <div
                  className={`glass h-full rounded-2xl overflow-hidden transition ${
                    isEmerald ? "hover:border-emerald/30" : "hover:border-electric/30"
                  }`}
                >
                  <div
                    className={`flex items-center gap-4 border-b border-border/60 p-6 ${
                      isEmerald ? "bg-emerald/5" : "bg-electric/5"
                    }`}
                  >
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-xl ${
                        isEmerald
                          ? "bg-emerald/15 ring-1 ring-emerald/30"
                          : "bg-electric/15 ring-1 ring-electric/30"
                      }`}
                    >
                      <pillar.icon
                        className={`h-6 w-6 ${isEmerald ? "text-emerald" : "text-electric"}`}
                      />
                    </span>
                    <h2 className="font-display text-xl font-semibold">{pillar.title}</h2>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
                    <ul className="mt-5 space-y-2.5">
                      {pillar.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm">
                          <CheckCircle2
                            className={`mt-0.5 h-4 w-4 shrink-0 ${
                              isEmerald ? "text-emerald" : "text-electric"
                            }`}
                          />
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* INFRASTRUCTURE */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Infrastructure"
            title="How we protect your data technically."
            description="We use trusted, industry-standard infrastructure so that you don't have to take our word for security alone."
          />
        </Reveal>
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Lock className="mt-1 h-5 w-5 shrink-0 text-emerald" />
            <div>
              <h3 className="font-semibold">Technical Safeguards</h3>
              <ul className="mt-4 space-y-2.5">
                {INFRASTRUCTURE_NOTES.map((note, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* COMMITMENTS */}
      <Section>
        <Reveal>
          <SectionHeading
            eyebrow="Our Commitments"
            title="What you can always expect from us."
            align="center"
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {COMMITMENTS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <GlassCard className="flex gap-4 h-full">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald/10 ring-1 ring-emerald/20">
                  <c.icon className="h-5 w-5 text-emerald" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold">{c.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FOOTER NOTE & CTA */}
      <Section>
        <Reveal>
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-electric" />
              <div>
                <h3 className="font-semibold">A note on our stage</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Vednix Technology is an early-stage startup. While we design with enterprise-grade
                  security principles, we are a growing company and our security posture will
                  continue to mature as we scale. We commit to transparency about our capabilities
                  and limitations.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass-strong rounded-3xl px-8 py-14 text-center sm:py-20">
            <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-emerald" />
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Questions about privacy or security?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              We're happy to answer any questions about how we handle your data, our security
              approach, or our compliance posture.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LinkButton to="/contact">Contact Us</LinkButton>
              <LinkButton to="/privacy" variant="outline">
                Read Privacy Policy <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
