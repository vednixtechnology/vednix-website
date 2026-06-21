import { Link } from "@tanstack/react-router";
import {
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Github,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "./Logo";

const COLS: {
  title: string;
  links: { label: string; to: string; external?: boolean }[];
}[] = [
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Insights", to: "/insights" },
      { label: "Investor Relations", to: "/investor-relations" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "SmartPocket", to: "/smartpocket" },
      { label: "Join Early Access", to: "/early-access" },
      { label: "Future Innovations", to: "/products" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Individuals", to: "/solutions" },
      { label: "Businesses", to: "/solutions" },
      { label: "Institutions", to: "/solutions" },
      { label: "For Banks", to: "/for-banks" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Trust Center", to: "/trust-center" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
      { label: "Disclaimer", to: "/disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border/60 bg-background/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
      <div className="container-px mx-auto max-w-7xl pb-10 pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand Column */}
          <div className="space-y-5">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Vednix Technology is building innovative financial technology
              solutions designed to simplify finance and improve financial
              behaviour through intelligent digital experiences.
            </p>

            <div className="space-y-2.5 text-sm text-muted-foreground">
              <a
                href="mailto:vednixtechnology@gmail.com"
                className="flex items-center gap-2 transition hover:text-foreground"
              >
                <Mail className="h-4 w-4 text-emerald" />
                vednixtechnology@gmail.com
              </a>
              <a
                href="tel:+919039462506"
                className="flex items-center gap-2 transition hover:text-foreground"
              >
                <Phone className="h-4 w-4 text-emerald" />
                +91 90394 62506
              </a>
              <a
                href="tel:+919131060960"
                className="flex items-center gap-2 transition hover:text-foreground"
              >
                <Phone className="h-4 w-4 text-emerald" />
                +91 91310 60960
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                187 Dudhia, Indore, Madhya Pradesh — 452001
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2 pt-1">
              <SocialLink
                href="https://www.linkedin.com/company/vednix-technology/"
                label="LinkedIn"
                icon={<Linkedin className="h-4 w-4" />}
              />
              <SocialLink
                href="https://www.instagram.com/vednix_technology_pvt_ltd"
                label="Instagram"
                icon={<Instagram className="h-4 w-4" />}
              />
              <SocialLink
                href="#"
                label="Twitter / X (coming soon)"
                icon={<Twitter className="h-4 w-4" />}
                disabled
              />
              <SocialLink
                href="#"
                label="YouTube (coming soon)"
                icon={<Youtube className="h-4 w-4" />}
                disabled
              />
              <SocialLink
                href="#"
                label="GitHub (coming soon)"
                icon={<Github className="h-4 w-4" />}
                disabled
              />
            </div>
          </div>

          {/* Navigation Columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label + l.to}>
                    {l.external ? (
                      <a
                        href={l.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-foreground/80 transition hover:text-emerald"
                      >
                        {l.label}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        to={l.to}
                        className="text-foreground/80 transition hover:text-emerald"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Registration Numbers */}
        <div className="mt-12 grid gap-3 rounded-2xl border border-border/60 bg-card/40 p-5 text-xs text-muted-foreground sm:grid-cols-3">
          <Badge label="CIN" value="U62020MP2026PTC082279" />
          <Badge label="DPIIT" value="DIPP251835" />
          <Badge label="MSME" value="UDYAM-MP-23-0273140" />
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 Vednix Technology Private Limited. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition">
              Terms
            </Link>
            <Link
              to="/trust-center"
              className="hover:text-foreground transition"
            >
              Trust Center
            </Link>
          </div>
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Made with
            <Heart
              className="h-3.5 w-3.5 fill-emerald text-emerald"
              aria-label="love"
            />
            in India
          </p>
        </div>
      </div>
    </footer>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="rounded-md bg-gradient-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
        {label}
      </span>
      <span className="font-mono text-foreground/80">{value}</span>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
  disabled,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  const cls =
    "grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/40 transition";
  if (disabled) {
    return (
      <span
        aria-label={label}
        title={label}
        className={`${cls} opacity-35 cursor-not-allowed`}
      >
        {icon}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`${cls} hover:border-emerald hover:text-emerald hover:shadow-emerald hover:-translate-y-0.5`}
    >
      {icon}
    </a>
  );
}
