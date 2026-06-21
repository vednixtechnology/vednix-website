import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { Link } from "@tanstack/react-router";

/* -------- Section wrapper -------- */
export function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`container-px mx-auto max-w-7xl section-py ${className}`}>
      {children}
    </section>
  );
}

/* -------- Eyebrow chip -------- */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald shadow-emerald" />
      {children}
    </span>
  );
}

/* -------- Section heading -------- */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

/* -------- Glass card -------- */
export function GlassCard({
  className = "",
  children,
  hover = true,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={`glass rounded-2xl p-6 transition ${
        hover ? "hover-lift hover:border-emerald/40" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* -------- Buttons -------- */
type BtnProps = {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "md" | "lg";
  children: ReactNode;
  className?: string;
};

function btnClasses({ variant = "primary", size = "md", className = "" }: BtnProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";
  const sizes = { md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base" };
  const variants = {
    primary:
      "bg-gradient-primary text-primary-foreground shadow-emerald hover:opacity-95 hover:-translate-y-0.5",
    secondary:
      "bg-electric text-accent-foreground hover:opacity-95 hover:-translate-y-0.5 shadow-glow",
    outline:
      "border border-border bg-card/40 text-foreground hover:bg-card hover:border-emerald/50",
    ghost: "text-foreground hover:bg-card/60",
  };
  return `${base} ${sizes[size]} ${variants[variant]} ${className}`;
}

export function LinkButton({
  to,
  external,
  href,
  ...rest
}: BtnProps & { to?: string; href?: string; external?: boolean }) {
  if (href || external) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={btnClasses(rest)}
      >
        {rest.children}
      </a>
    );
  }
  return (
    <Link to={to ?? "/"} className={btnClasses(rest)}>
      {rest.children}
    </Link>
  );
}

export function Button({
  type = "button",
  ...rest
}: BtnProps & ComponentPropsWithoutRef<"button">) {
  const { variant, size, className, children, ...native } = rest;
  return (
    <button type={type} {...native} className={btnClasses({ variant, size, className, children })}>
      {children}
    </button>
  );
}

/* -------- Reveal on scroll -------- */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------- Animated counter -------- */
export function Counter({
  to,
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 20 });
  const rounded = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(() => {
    return rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = v + suffix;
    });
  }, [rounded, suffix]);

  return (
    <span ref={ref} aria-label={`${to}${suffix}`}>
      0{suffix}
    </span>
  );
}

/* -------- Background glow -------- */
export function BackgroundGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-electric/15 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald/15 blur-[100px]" />
      <div className="absolute inset-0 grid-bg opacity-50" />
    </div>
  );
}
