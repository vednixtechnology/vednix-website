import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" aria-label="Vednix Technology home" className="group flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-emerald">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6l8 14L20 6" />
          <path d="M9 6h6" opacity=".7" />
        </svg>
        <span className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 blur-lg transition group-hover:opacity-60" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-bold tracking-tight">VEDNIX</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Technology
          </span>
        </span>
      )}
    </Link>
  );
}
