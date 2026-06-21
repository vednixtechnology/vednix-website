import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — Vednix Technology" },
      {
        name: "description",
        content:
          "Disclaimer regarding information provided on the Vednix Technology website.",
      },
      { property: "og:title", content: "Disclaimer — Vednix Technology" },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: DisclaimerPage,
});

const TOC = [
  { id: "general", label: "General" },
  { id: "future", label: "Future Plans" },
];

function DisclaimerPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Disclaimer"
      subtitle="Information on this website is provided for general purposes only."
      toc={TOC}
    >
      <LegalSection id="general" title="General">
        <p>
          The information provided on this website is intended for general
          informational purposes only. Nothing on this website should be
          interpreted as financial advice, investment advice, legal advice, tax
          advice, or professional consulting.
        </p>
      </LegalSection>

      <LegalSection id="future" title="Future Plans">
        <p>
          SmartPocket and other future products may continue evolving during
          development. Future plans, product roadmaps, partnerships, and
          technology directions represent current intentions and may change
          without prior notice.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
