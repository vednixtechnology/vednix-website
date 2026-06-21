import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Linkedin,
  Instagram,
} from "lucide-react";
import {
  Section,
  GlassCard,
  Reveal,
  BackgroundGlow,
  Eyebrow,
  Button,
} from "@/components/site/primitives";
import { save } from "@/lib/submissions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Vednix Technology" },
      {
        name: "description",
        content:
          "Get in touch with Vednix Technology. Whether you're a user, startup, investor, institution, or future banking partner — our team is ready to connect.",
      },
      { property: "og:title", content: "Contact — Vednix Technology" },
      { property: "og:description", content: "Connect with the Vednix Technology team." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Only digits and + - ( ) are allowed"),
  subject: z.string().trim().min(3, "Please add a subject").max(120),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(2000),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please agree to the Privacy Policy and Terms" }),
  }),
});
type FormValues = z.infer<typeof schema>;

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await save("contact_messages", {
        ...values,
        email: values.email.toLowerCase().trim(),
      });
      setSuccess(true);
      reset();
    } catch {
      setError("Something went wrong. Please try again or email us directly at vednixtechnology@gmail.com");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Let's <span className="text-gradient">connect</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Whether you're a user, startup, investor, institution, or future banking partner —
            we'd love to hear from you.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr]">
          <Reveal>
            <div className="space-y-5">
              <h2 className="font-display text-2xl font-semibold">Contact information</h2>
              <p className="text-sm text-muted-foreground">
                Vednix Technology Private Limited
              </p>

              <div className="space-y-4">
                <InfoRow icon={Mail} label="Email">
                  <a
                    href="mailto:vednixtechnology@gmail.com"
                    className="hover:text-emerald transition"
                  >
                    vednixtechnology@gmail.com
                  </a>
                </InfoRow>
                <InfoRow icon={Phone} label="Phone">
                  <a href="tel:+919039462506" className="hover:text-emerald transition">
                    +91 90394 62506
                  </a>
                  <span className="mx-2 text-muted-foreground">·</span>
                  <a href="tel:+919131060960" className="hover:text-emerald transition">
                    +91 91310 60960
                  </a>
                </InfoRow>
                <InfoRow icon={MapPin} label="Office">
                  187 Dudhia, Indore, Madhya Pradesh — 452001
                </InfoRow>
                <InfoRow icon={Clock} label="Office Hours">
                  Monday – Friday · 9:30 AM – 6:30 PM IST
                </InfoRow>
              </div>

              {/* Social */}
              <div className="pt-2">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Follow Us
                </p>
                <div className="flex gap-2">
                  <a
                    href="https://www.linkedin.com/company/vednix-technology/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/40 text-muted-foreground transition hover:border-emerald hover:text-emerald"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/vednix_technology_pvt_ltd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/40 text-muted-foreground transition hover:border-emerald hover:text-emerald"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Registrations */}
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Legal Registrations
                </p>
                <ul className="mt-3 space-y-1.5 text-sm font-mono text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="rounded bg-card px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">CIN</span>
                    U62020MP2026PTC082279
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="rounded bg-card px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">DPIIT</span>
                    DIPP251835
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="rounded bg-card px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">MSME</span>
                    UDYAM-MP-23-0273140
                  </li>
                </ul>
              </div>

              {/* Google Maps embed */}
              <div className="overflow-hidden rounded-2xl border border-border/60">
                <iframe
                  title="Vednix Technology Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.9!2d75.8577!3d22.7196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQzJzEwLjYiTiA3NcKwNTEnMjcuNyJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Map showing Vednix Technology office in Indore, Madhya Pradesh"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard hover={false}>
              {success ? (
                <SuccessState onReset={() => setSuccess(false)} />
              ) : (
                <>
                  <h3 className="font-display text-lg font-semibold">Send us a message</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We typically respond within 1–2 business days.
                  </p>

                  {error && (
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-5 grid gap-5" noValidate>
                    <Field label="Full Name" error={errors.fullName?.message}>
                      <input
                        {...register("fullName")}
                        autoComplete="name"
                        className="input"
                        placeholder="Jane Doe"
                      />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Email" error={errors.email?.message}>
                        <input
                          {...register("email")}
                          type="email"
                          autoComplete="email"
                          className="input"
                          placeholder="you@example.com"
                        />
                      </Field>
                      <Field label="Phone Number" error={errors.phone?.message}>
                        <input
                          {...register("phone")}
                          type="tel"
                          autoComplete="tel"
                          className="input"
                          placeholder="+91 9XXXXXXXXX"
                        />
                      </Field>
                    </div>
                    <Field label="Subject" error={errors.subject?.message}>
                      <input
                        {...register("subject")}
                        className="input"
                        placeholder="How can we help?"
                      />
                    </Field>
                    <Field label="Message" error={errors.message?.message}>
                      <textarea
                        {...register("message")}
                        className="textarea-base min-h-[120px]"
                        placeholder="Tell us a little more about what you're looking for..."
                      />
                    </Field>

                    <label className="flex items-start gap-3 text-sm">
                      <input
                        {...register("consent")}
                        type="checkbox"
                        className="mt-1 h-4 w-4 accent-emerald-500"
                      />
                      <span className="text-muted-foreground">
                        I agree to the{" "}
                        <a href="/privacy" className="text-foreground underline underline-offset-2 hover:text-emerald">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="/terms" className="text-foreground underline underline-offset-2 hover:text-emerald">
                          Terms & Conditions
                        </a>
                        .
                      </span>
                    </label>
                    {errors.consent?.message && (
                      <p className="-mt-3 text-xs text-destructive">{errors.consent.message}</p>
                    )}

                    <Button type="submit" disabled={submitting} size="lg">
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </GlassCard>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald/15 text-emerald shadow-emerald">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold">Message sent — thank you!</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        We've received your message and will get back to you within 1–2 business days.
      </p>
      <button
        onClick={onReset}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card/40 px-5 text-sm font-semibold transition hover:bg-card"
      >
        Send another message
      </button>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary/15 ring-1 ring-emerald/30">
        <Icon className="h-4 w-4 text-emerald" />
      </span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
        <p className="text-sm text-foreground/90">{children}</p>
      </div>
    </div>
  );
}
