import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Vednix Technology" },
      {
        name: "description",
        content: "How Vednix Technology uses cookies on its website.",
      },
      { property: "og:title", content: "Cookie Policy — Vednix Technology" },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

const TOC = [
  { id: "what", label: "What we use cookies for" },
  { id: "control", label: "Your control" },
];

function CookiesPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Cookie Policy"
      subtitle="How we use cookies on this website."
      toc={TOC}
    >
      <LegalSection id="what" title="What we use cookies for">
        <p>Cookies may be used for:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Website functionality</li>
          <li>Analytics</li>
          <li>Performance</li>
          <li>Security</li>
          <li>Remembering preferences</li>
        </ul>
      </LegalSection>

      <LegalSection id="control" title="Your control">
        <p>
          Users may disable cookies through their browser settings. Disabling
          some cookies may affect website functionality.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
