import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import {
  Section,
  GlassCard,
  Reveal,
  BackgroundGlow,
  Eyebrow,
  Button,
} from "@/components/site/primitives";
import { save, emailExists } from "@/lib/submissions";

export const Route = createFileRoute("/early-access")({
  head: () => ({
    meta: [
      { title: "Join Early Access — SmartPocket | Vednix Technology" },
      {
        name: "description",
        content:
          "Be among the first to experience SmartPocket before its public launch. Get priority access, exclusive previews, and help shape the future of intelligent personal finance.",
      },
      { property: "og:title", content: "Early Access — SmartPocket by Vednix Technology" },
      { property: "og:description", content: "Join the SmartPocket Early Access Program. Limited spots available." },
      { property: "og:url", content: "/early-access" },
    ],
    links: [{ rel: "canonical", href: "/early-access" }],
  }),
  component: EarlyAccessPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Only digits and + - ( ) are allowed"),
  occupation: z.string().trim().min(2, "Please enter your occupation").max(80),
  city: z.string().trim().min(2, "Please enter your city").max(60),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please agree to receive updates" }),
  }),
});

type FormValues = z.infer<typeof schema>;

function EarlyAccessPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const normalizedEmail = values.email.toLowerCase().trim();

      // Prevent duplicate registrations
      const alreadyRegistered = await emailExists("early_access_users", normalizedEmail);
      if (alreadyRegistered) {
        setError(
          "This email is already registered for Early Access. We'll be in touch soon!"
        );
        setSubmitting(false);
        return;
      }

      await save("early_access_users", {
        ...values,
        email: normalizedEmail,
      });
      navigate({ to: "/thank-you" });
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl text-center">
          <Eyebrow>Early Access · Invite-only</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Join the <span className="text-gradient">Early Access</span> Program.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Be among the first to experience SmartPocket before its public launch. Early members
            receive priority access, exclusive product previews, and the opportunity to directly
            shape the product.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold">What you'll get</h2>
              <ul className="space-y-4">
                {[
                  {
                    title: "Priority Access",
                    desc: "Be among the first to access SmartPocket when it launches — before the general public.",
                  },
                  {
                    title: "Exclusive Previews",
                    desc: "Get sneak peeks at upcoming features and give feedback before they ship.",
                  },
                  {
                    title: "Founder Updates",
                    desc: "Receive personal updates from the Vednix team on our progress and journey.",
                  },
                  {
                    title: "Shape the Product",
                    desc: "Your feedback directly influences the features we build and prioritize.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald/15 text-emerald">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-emerald" />
                  <div>
                    <p className="text-sm font-semibold">Privacy Commitment</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your data is stored securely on Firebase and used only to keep you informed
                      about SmartPocket. We never sell or share your information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard hover={false}>
              <h3 className="font-display text-lg font-semibold">Register for Early Access</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in your details to secure your spot.
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
                    type="text"
                    autoComplete="name"
                    className="input"
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email Address" error={errors.email?.message}>
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
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Occupation" error={errors.occupation?.message}>
                    <input
                      {...register("occupation")}
                      type="text"
                      className="input"
                      placeholder="Student, Engineer..."
                    />
                  </Field>
                  <Field label="City" error={errors.city?.message}>
                    <input
                      {...register("city")}
                      type="text"
                      autoComplete="address-level2"
                      className="input"
                      placeholder="Indore"
                    />
                  </Field>
                </div>

                <label className="flex items-start gap-3 text-sm">
                  <input
                    {...register("consent")}
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-border bg-card accent-emerald-500"
                  />
                  <span className="text-muted-foreground">
                    I agree to receive product updates and launch notifications about SmartPocket
                    from Vednix Technology.
                  </span>
                </label>
                {errors.consent?.message && (
                  <p className="-mt-3 text-xs text-destructive">{errors.consent.message}</p>
                )}

                <Button type="submit" disabled={submitting} size="lg">
                  {submitting ? "Joining…" : "Join Early Access"}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            </GlassCard>
          </Reveal>
        </div>
      </Section>
    </>
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
