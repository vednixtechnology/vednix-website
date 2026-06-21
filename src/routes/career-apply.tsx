import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2, ChevronLeft, Upload } from "lucide-react";
import {
  Section,
  GlassCard,
  Reveal,
  BackgroundGlow,
  Eyebrow,
  Button,
} from "@/components/site/primitives";
import { saveCareerApplication } from "@/lib/submissions";

export const Route = createFileRoute("/career-apply")({
  validateSearch: (search: Record<string, unknown>) => ({
    position: typeof search.position === "string" ? search.position : "",
  }),
  head: () => ({
    meta: [
      { title: "Apply — Vednix Technology Internships" },
      {
        name: "description",
        content:
          "Apply for an internship at Vednix Technology. Join us in building intelligent financial infrastructure.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/career-apply" }],
  }),
  component: CareerApplyPage,
});

const POSITIONS = [
  "Flutter Developer Intern",
  "Node.js Developer Intern",
  "Marketing & Growth Intern",
  "React Frontend Intern",
  "UI/UX Design Intern",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const AVAILABILITY = ["Immediately", "Within 2 weeks", "Within 1 month", "After 2 months"];
const WORK_MODES = ["Remote", "Hybrid", "On-site (Indore)"];

const schema = z.object({
  position: z.string().min(1, "Please select a position"),
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Only digits and + - ( ) are allowed"),
  city: z.string().trim().min(2, "Please enter your city").max(60),
  college: z.string().trim().min(2, "Please enter your college name").max(150),
  degree: z.string().trim().min(2, "Please enter your degree").max(80),
  branch: z.string().trim().min(2, "Please enter your branch").max(80),
  currentYear: z.string().min(1, "Please select your current year"),
  graduationYear: z
    .string()
    .trim()
    .min(4, "Enter graduation year")
    .max(4, "Enter 4-digit year")
    .regex(/^\d{4}$/, "Enter a valid year like 2026"),
  linkedin: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(200)
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(200)
    .optional()
    .or(z.literal("")),
  portfolio: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(200)
    .optional()
    .or(z.literal("")),
  resumeLink: z
    .string()
    .trim()
    .url("Please enter a valid Google Drive link")
    .max(500)
    .refine(
      (v) => v.includes("drive.google.com") || v.includes("docs.google.com"),
      "Please share a Google Drive link"
    ),
  whyVednix: z
    .string()
    .trim()
    .min(50, "Please write at least 50 characters")
    .max(1000, "Max 1000 characters"),
  availability: z.string().min(1, "Please select availability"),
  workMode: z.string().min(1, "Please select preferred work mode"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm your consent to proceed" }),
  }),
});

type FormValues = z.infer<typeof schema>;

function CareerApplyPage() {
  const { position: prefilledPosition } = useSearch({ from: "/career-apply" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      position: prefilledPosition || "",
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await saveCareerApplication({
        ...values,
        email: values.email.toLowerCase().trim(),
        linkedin: values.linkedin || null,
        github: values.github || null,
        portfolio: values.portfolio || null,
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="relative flex min-h-[80vh] items-center overflow-hidden">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-3xl text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald/15 text-emerald shadow-emerald">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <Eyebrow>Application Submitted</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
            Thank you for <span className="text-gradient">applying</span>!
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            We've received your application and will review it carefully. If you're shortlisted, our
            team will reach out to you via email within 7–10 business days.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/careers"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-primary px-5 text-sm font-semibold text-primary-foreground shadow-emerald transition hover:opacity-90"
            >
              Back to Careers
            </Link>
            <Link
              to="/"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card/40 px-5 text-sm font-semibold transition hover:bg-card"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-5xl">
          <Link
            to="/careers"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Careers
          </Link>
          <div className="mt-6">
            <Eyebrow>Internship Application</Eyebrow>
            <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
              Apply to join <span className="text-gradient">Vednix Technology</span>.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Fill in the details below. All fields marked with * are required. We review every
              application carefully.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <Reveal>
          <GlassCard hover={false} className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6" noValidate>
              {/* SECTION: Position */}
              <FormSection title="Position">
                <Field label="Applying for *" error={errors.position?.message}>
                  <select {...register("position")} className="input">
                    <option value="">Select a position</option>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>
              </FormSection>

              {/* SECTION: Personal Information */}
              <FormSection title="Personal Information">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name *" error={errors.fullName?.message}>
                    <input
                      {...register("fullName")}
                      autoComplete="name"
                      className="input"
                      placeholder="Jane Doe"
                    />
                  </Field>
                  <Field label="City *" error={errors.city?.message}>
                    <input
                      {...register("city")}
                      autoComplete="address-level2"
                      className="input"
                      placeholder="Indore"
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Email Address *" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      className="input"
                      placeholder="you@example.com"
                    />
                  </Field>
                  <Field label="Phone Number *" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                      className="input"
                      placeholder="+91 9XXXXXXXXX"
                    />
                  </Field>
                </div>
              </FormSection>

              {/* SECTION: Academic Details */}
              <FormSection title="Academic Details">
                <Field label="College / University *" error={errors.college?.message}>
                  <input
                    {...register("college")}
                    className="input"
                    placeholder="IIT Indore, IIST Indore, etc."
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Degree *" error={errors.degree?.message}>
                    <input
                      {...register("degree")}
                      className="input"
                      placeholder="B.Tech, BCA, MBA..."
                    />
                  </Field>
                  <Field label="Branch / Specialization *" error={errors.branch?.message}>
                    <input
                      {...register("branch")}
                      className="input"
                      placeholder="Computer Science, Finance..."
                    />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Current Year *" error={errors.currentYear?.message}>
                    <select {...register("currentYear")} className="input">
                      <option value="">Select year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Graduation Year *" error={errors.graduationYear?.message}>
                    <input
                      {...register("graduationYear")}
                      className="input"
                      placeholder="2027"
                      maxLength={4}
                    />
                  </Field>
                </div>
              </FormSection>

              {/* SECTION: Online Profiles */}
              <FormSection title="Online Profiles">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="LinkedIn Profile" error={errors.linkedin?.message}>
                    <input
                      {...register("linkedin")}
                      type="url"
                      className="input"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </Field>
                  <Field label="GitHub Profile" error={errors.github?.message}>
                    <input
                      {...register("github")}
                      type="url"
                      className="input"
                      placeholder="https://github.com/username"
                    />
                  </Field>
                </div>
                <Field label="Portfolio / Website" error={errors.portfolio?.message}>
                  <input
                    {...register("portfolio")}
                    type="url"
                    className="input"
                    placeholder="https://yourwebsite.com"
                  />
                </Field>
                <Field label="Resume (Google Drive Link) *" error={errors.resumeLink?.message}>
                  <div className="relative">
                    <input
                      {...register("resumeLink")}
                      type="url"
                      className="input pr-10"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                    <Upload className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Share your resume via Google Drive with link access set to "Anyone with the
                    link"
                  </p>
                </Field>
              </FormSection>

              {/* SECTION: Application */}
              <FormSection title="Your Application">
                <Field
                  label="Why do you want to join Vednix? *"
                  error={errors.whyVednix?.message}
                >
                  <textarea
                    {...register("whyVednix")}
                    className="textarea-base min-h-[140px]"
                    placeholder="Tell us about your motivation, what excites you about fintech, and what you hope to contribute to Vednix Technology..."
                  />
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    Min 50 characters · Max 1000 characters
                  </p>
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Availability *" error={errors.availability?.message}>
                    <select {...register("availability")} className="input">
                      <option value="">When can you start?</option>
                      {AVAILABILITY.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Preferred Work Mode *" error={errors.workMode?.message}>
                    <select {...register("workMode")} className="input">
                      <option value="">Select work mode</option>
                      {WORK_MODES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </FormSection>

              {/* Consent */}
              <div>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    {...register("consent")}
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-emerald-500"
                  />
                  <span className="text-muted-foreground">
                    I confirm that all the information provided is accurate and complete. I consent
                    to Vednix Technology storing and using this data to evaluate my application.
                  </span>
                </label>
                {errors.consent?.message && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.consent.message}</p>
                )}
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={submitting} size="lg">
                {submitting ? "Submitting Application…" : "Submit Application"}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </GlassCard>
        </Reveal>
      </Section>
    </>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border/60" />
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h3>
        <span className="h-px flex-1 bg-border/60" />
      </div>
      {children}
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
