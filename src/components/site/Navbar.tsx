import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { label: "About", to: "/about" },
  {
    label: "Products",
    to: "/products",
    children: [
      {
        label: "SmartPocket",
        to: "/smartpocket",
        desc: "AI-powered financial behaviour",
      },
      {
        label: "Future Innovations",
        to: "/products",
        desc: "What's coming next",
      },
    ],
  },
  {
    label: "Solutions",
    to: "/solutions",
    children: [
      { label: "Individuals", to: "/solutions", desc: "Personal finance" },
      { label: "Businesses", to: "/solutions", desc: "Business tools" },
      { label: "Institutions", to: "/solutions", desc: "Education & Gov" },
      { label: "For Banks", to: "/for-banks", desc: "Banking infrastructure" },
    ],
  },
  { label: "Careers", to: "/careers" },
  { label: "Insights", to: "/insights" },
  { label: "Contact", to: "/contact" },
] as const;

type NavItem = {
  label: string;
  to: string;
  children?: { label: string; to: string; desc: string }[];
};

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <Logo />

        <nav
          className="hidden items-center gap-0.5 lg:flex"
          aria-label="Primary"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {(NAV as NavItem[]).map((item) => {
            const active =
              pathname === item.to ||
              pathname.startsWith(item.to + "/") ||
              item.children?.some(
                (c) => pathname === c.to || pathname.startsWith(c.to + "/"),
              );

            if (item.children) {
              return (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                >
                  <button
                    className={`relative flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-expanded={activeDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                    {active && (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-primary" />
                    )}
                  </button>

                  {activeDropdown === item.label && (
                    <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-border/60 bg-background/95 shadow-card backdrop-blur-xl">
                      <div className="p-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.to + child.label}
                            to={child.to}
                            className="block rounded-lg px-3 py-2.5 transition hover:bg-card"
                          >
                            <p className="text-sm font-medium text-foreground">
                              {child.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {child.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/early-access"
            className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground shadow-emerald transition hover:opacity-90 hover:-translate-y-0.5"
          >
            Early Access
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/40 transition hover:bg-card lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden">
          <nav
            className="container-px mx-auto max-w-7xl py-4"
            aria-label="Mobile"
          >
            <ul className="grid gap-1">
              {(NAV as NavItem[]).map((item) => (
                <li key={item.to}>
                  {item.children ? (
                    <div>
                      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {item.label}
                      </p>
                      <div className="ml-3 grid gap-0.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.to + child.label}
                            to={child.to}
                            className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.to}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/early-access"
                  className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-primary px-4 text-sm font-semibold text-primary-foreground shadow-emerald"
                >
                  Join Early Access
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
