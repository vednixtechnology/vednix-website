import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { LinkButton, BackgroundGlow, Eyebrow } from "@/components/site/primitives";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Welcome to the Vednix Community" },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Welcome to the Vednix Community" },
      { property: "og:url", content: "/thank-you" },
    ],
    links: [{ rel: "canonical", href: "/thank-you" }],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <BackgroundGlow />
      <div className="container-px relative mx-auto max-w-3xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald/15 text-emerald shadow-emerald">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <Eyebrow>Early Access Confirmed</Eyebrow>
        <h1 className="mt-5 font-display text-4xl font-bold sm:text-5xl">
          Welcome to the <span className="text-gradient">Vednix Community</span>!
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Thank you for joining our Early Access Program. We're excited to have you with us and
          will keep you updated on SmartPocket's journey.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton to="/">Back to Home</LinkButton>
          <LinkButton to="/smartpocket" variant="outline">
            Explore SmartPocket <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
