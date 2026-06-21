import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-border bg-card/80 text-muted-foreground shadow-card backdrop-blur-xl transition hover:border-emerald hover:text-emerald hover:shadow-emerald hover:-translate-y-0.5 animate-fade-in-up"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
