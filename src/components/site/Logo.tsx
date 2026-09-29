import { Link } from "@tanstack/react-router";

interface LogoProps {
  compact?: boolean;
  companyName?: string;
  logoUrl?: string;
}

export function Logo({
  compact = false,
  companyName = "Vednix Technology",
  logoUrl = "/logo.png",
}: LogoProps) {
  // Splits "Vednix Technology" -> "VEDNIX" / "Technology", matching the
  // original two-line wordmark. Falls back gracefully for any other name.
  const [firstWord, ...rest] = companyName.trim().split(/\s+/);
  const subtitle = rest.join(" ") || "Technology";

  return (
    <Link
      to="/"
      aria-label={`${companyName} home`}
      className="group flex items-center gap-2.5"
    >
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary shadow-emerald">
        <img
          src={logoUrl}
          alt={companyName}
          className="h-9 w-9 object-contain"
        />
        <span className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 blur-lg transition group-hover:opacity-60" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-bold tracking-tight">
            {firstWord.toUpperCase()}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {subtitle}
          </span>
        </span>
      )}
    </Link>
  );
}
