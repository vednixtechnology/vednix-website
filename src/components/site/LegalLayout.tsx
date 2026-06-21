import { useEffect, useState, type ReactNode } from "react";
import {
  Section,
  Reveal,
  BackgroundGlow,
  Eyebrow,
} from "@/components/site/primitives";

export interface TocItem {
  id: string;
  label: string;
}

export function LegalLayout({
  eyebrow,
  title,
  subtitle,
  toc,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  toc: TocItem[];
  children: ReactNode;
}) {
  const [active, setActive] = useState<string>(toc[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    toc.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [toc]);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-primary"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
      <section className="relative overflow-hidden pt-16 md:pt-24">
        <BackgroundGlow />
        <div className="container-px relative mx-auto max-w-4xl text-center">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            Effective from February 2026
          </p>
        </div>
      </section>

      <Section className="!pt-12">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                On this page
              </p>
              <nav>
                <ul className="space-y-1.5 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className={`block rounded-md border-l-2 px-3 py-1.5 transition ${
                          active === t.id
                            ? "border-emerald bg-card/60 text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <Reveal>
            <article className="legal-prose">{children}</article>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border/60 py-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
