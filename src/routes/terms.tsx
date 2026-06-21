import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Vednix Technology" },
      { name: "description", content: "Terms governing your use of the Vednix Technology website and services." },
      { property: "og:title", content: "Terms & Conditions — Vednix Technology" },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

const TOC = [
  { id: "intro", label: "Introduction" },
  { id: "use", label: "Website Usage" },
  { id: "ip", label: "Intellectual Property" },
  { id: "smartpocket", label: "SmartPocket" },
  { id: "accuracy", label: "Accuracy" },
  { id: "third", label: "Third Party Links" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "changes", label: "Changes" },
];

function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms & Conditions"
      subtitle="The terms that govern your use of this website."
      toc={TOC}
    >
      <LegalSection id="intro" title="Introduction">
        <p>
          By accessing or using the Vednix Technology website, you agree to these Terms &
          Conditions.
        </p>
      </LegalSection>

      <LegalSection id="use" title="Website Usage">
        <p>Users agree to use the website responsibly and lawfully.</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Do not misuse any services.</li>
          <li>Do not attempt unauthorized access.</li>
          <li>Do not interfere with website functionality.</li>
        </ul>
      </LegalSection>

      <LegalSection id="ip" title="Intellectual Property">
        <p>All content including:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Logo, Brand Name, Graphics, Design, Illustrations, UI</li>
          <li>Content, Images, Videos</li>
          <li>Source Code, Product Concepts, Documentation</li>
        </ul>
        <p>remain the intellectual property of Vednix Technology unless otherwise stated.</p>
      </LegalSection>

      <LegalSection id="smartpocket" title="SmartPocket">
        <p>
          Information regarding SmartPocket is provided for informational purposes. Features may
          evolve before official public release.
        </p>
      </LegalSection>

      <LegalSection id="accuracy" title="Accuracy">
        <p>
          We strive to keep information accurate and updated. However, some information may change
          over time as products evolve.
        </p>
      </LegalSection>

      <LegalSection id="third" title="Third Party Links">
        <p>
          The website may contain links to external websites. Vednix Technology is not responsible
          for third-party content or privacy practices.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="Limitation of Liability">
        <p>
          Vednix Technology shall not be responsible for indirect, incidental, or consequential
          losses arising from the use of this website.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes">
        <p>Terms may be updated periodically. Users should review this page regularly.</p>
      </LegalSection>
    </LegalLayout>
  );
}
