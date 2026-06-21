import { Award, Building2, GraduationCap, Landmark, ShieldCheck, Flame, Zap, Brain } from "lucide-react";

const ITEMS = [
  { label: "DPIIT Recognized", icon: Award },
  { label: "MSME Registered", icon: Building2 },
  { label: "IIT Indore ACE Foundation", icon: Landmark },
  { label: "IIST Indore", icon: GraduationCap },
  { label: "Startup India", icon: ShieldCheck },
  { label: "Firebase Powered", icon: Flame },
  { label: "AI-Driven", icon: Brain },
  { label: "Privacy First", icon: Zap },
];

export function TrustBar() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <section
      aria-label="Recognitions, technology, and commitments"
      className="relative border-y border-border/60 bg-card/30 py-8"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-14 px-6">
          {loop.map((it, i) => (
            <div key={i} className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
              <it.icon className="h-4 w-4 text-emerald" aria-hidden="true" />
              <span className="font-medium tracking-[0.1em]">{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
