import { motion } from "framer-motion";
import { TrendingUp, Sparkles, ShieldCheck, Wallet, BarChart3, Cpu } from "lucide-react";

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* Glow */}
      <div className="absolute inset-8 rounded-full bg-gradient-primary opacity-20 blur-3xl" />

      {/* AI network rings */}
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full opacity-40">
        <defs>
          <linearGradient id="ring" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.74 0.17 162)" />
            <stop offset="100%" stopColor="oklch(0.66 0.20 255)" />
          </linearGradient>
        </defs>
        {[180, 140, 100].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="url(#ring)"
            strokeWidth="1"
            strokeDasharray={i === 0 ? "4 8" : i === 1 ? "2 12" : "1 6"}
            opacity={0.7 - i * 0.15}
          />
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * 140;
          const y = 200 + Math.sin(rad) * 140;
          return <circle key={i} cx={x} cy={y} r="3" fill="oklch(0.74 0.17 162)" />;
        })}
      </svg>

      {/* Phone mockup */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-1/2 h-[68%] w-[44%] -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative h-full w-full rounded-[2rem] border border-white/15 bg-gradient-to-b from-surface to-background shadow-lift">
          <div className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/15" />
          <div className="absolute inset-3 overflow-hidden rounded-[1.6rem] bg-background p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Balance</p>
                <p className="font-display text-base font-bold">₹ 1,24,890</p>
              </div>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary">
                <Wallet className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-card p-2.5">
              <div className="flex items-end justify-between gap-1">
                {[40, 65, 35, 78, 52, 90, 60].map((h, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-sm bg-gradient-to-t from-emerald to-electric"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[8px] text-muted-foreground">Spend this week</p>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { l: "Groceries", v: "₹ 1,240" },
                { l: "Transport", v: "₹ 380" },
                { l: "Subscriptions", v: "₹ 599" },
              ].map((r) => (
                <div key={r.l} className="flex items-center justify-between rounded-lg bg-card/60 px-2 py-1.5 text-[10px]">
                  <span className="text-muted-foreground">{r.l}</span>
                  <span className="font-mono font-semibold">{r.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating cards */}
      <FloatCard
        className="left-0 top-10 sm:-left-4"
        delay={0.2}
        icon={<TrendingUp className="h-4 w-4 text-emerald" />}
        title="+18.4%"
        sub="Savings this month"
      />
      <FloatCard
        className="right-0 top-24 sm:-right-2"
        delay={0.4}
        icon={<Sparkles className="h-4 w-4 text-electric" />}
        title="AI Insight"
        sub="3 ways to save ₹1,200"
      />
      <FloatCard
        className="bottom-12 left-2"
        delay={0.6}
        icon={<ShieldCheck className="h-4 w-4 text-emerald" />}
        title="Bank-grade"
        sub="End-to-end secure"
      />
      <FloatCard
        className="bottom-4 right-2 sm:-right-2"
        delay={0.8}
        icon={<BarChart3 className="h-4 w-4 text-electric" />}
        title="Smart Categories"
        sub="Auto-organized"
      />
      <FloatCard
        className="left-1/2 top-0 -translate-x-1/2"
        delay={1.0}
        icon={<Cpu className="h-4 w-4 text-emerald" />}
        title="Vednix AI"
        sub="Always learning"
      />
    </div>
  );
}

function FloatCard({
  className,
  icon,
  title,
  sub,
  delay = 0,
}: {
  className?: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${className}`}
    >
      <div className="glass-strong animate-float flex items-center gap-2.5 rounded-xl px-3 py-2 shadow-card">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-card/80">{icon}</span>
        <div className="leading-tight">
          <p className="text-xs font-semibold">{title}</p>
          <p className="text-[10px] text-muted-foreground">{sub}</p>
        </div>
      </div>
    </motion.div>
  );
}
