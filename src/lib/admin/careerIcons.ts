import {
  Code2,
  Server,
  Megaphone,
  Sparkles,
  Rocket,
  GraduationCap,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  Briefcase,
  Palette,
  Database,
} from "lucide-react";

export const CAREER_ICONS = {
  code: { icon: Code2, label: "Code (Engineering)" },
  server: { icon: Server, label: "Server (Backend)" },
  database: { icon: Database, label: "Database" },
  megaphone: { icon: Megaphone, label: "Megaphone (Marketing)" },
  palette: { icon: Palette, label: "Palette (Design)" },
  sparkles: { icon: Sparkles, label: "Sparkles" },
  rocket: { icon: Rocket, label: "Rocket" },
  graduation: { icon: GraduationCap, label: "Graduation Cap" },
  shield: { icon: ShieldCheck, label: "Shield" },
  lightbulb: { icon: Lightbulb, label: "Lightbulb" },
  trending: { icon: TrendingUp, label: "Trending Up" },
  briefcase: { icon: Briefcase, label: "Briefcase (Generic)" },
} as const;

export type CareerIconKey = keyof typeof CAREER_ICONS;

export function getCareerIcon(key: string) {
  return (CAREER_ICONS[key as CareerIconKey] ?? CAREER_ICONS.briefcase).icon;
}
