import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout, LegalSection } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Vednix Technology" },
      {
        name: "description",
        content:
          "How Vednix Technology collects, uses, stores, and safeguards your information.",
      },
      { property: "og:title", content: "Privacy Policy — Vednix Technology" },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

const TOC = [
  { id: "intro", label: "Introduction" },
  { id: "collect", label: "Information We Collect" },
  { id: "use", label: "How We Use Information" },
  { id: "protect", label: "Data Protection" },
  { id: "third", label: "Third Party Services" },
  { id: "rights", label: "User Rights" },
  { id: "contact", label: "Contact" },
];

function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      subtitle="Your privacy is important to Vednix Technology."
      toc={TOC}
    >
      <LegalSection id="intro" title="Introduction">
        <p>
          Vednix Technology respects your privacy and is committed to protecting
          your personal information. This Privacy Policy explains how we
          collect, use, store, and safeguard information when you use our
          website, join our Early Access Program, contact us, or use our
          products and services, including SmartPocket.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="Information We Collect">
        <p>We may collect information such as:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Phone Number</li>
          <li>City</li>
          <li>Occupation</li>
          <li>Contact Form Information</li>
          <li>Device & Browser Information</li>
          <li>IP Address</li>
          <li>Cookies & Website Analytics</li>
          <li>Usage Data</li>
        </ul>
        <p>
          When SmartPocket becomes available, additional information may be
          collected only as required to provide the requested services and in
          accordance with applicable laws.
        </p>
      </LegalSection>

      <LegalSection id="use" title="How We Use Information">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Improve products</li>
          <li>Respond to enquiries</li>
          <li>Provide customer support</li>
          <li>Send important updates</li>
          <li>Notify users about launches</li>
          <li>Improve security</li>
          <li>Improve user experience</li>
          <li>Conduct analytics</li>
          <li>Comply with legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection id="protect" title="Data Protection">
        <p>
          We implement reasonable administrative, technical, and organizational
          safeguards to protect personal information against unauthorized
          access, misuse, alteration, or disclosure.
        </p>
      </LegalSection>

      <LegalSection id="third" title="Third Party Services">
        <p>The website may use trusted third-party services including:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Firebase</li>
          <li>Google Analytics</li>
          <li>Google Fonts</li>
          <li>Cloud Hosting</li>
          <li>Email Services</li>
          <li>Other secure technology partners where necessary.</li>
        </ul>
      </LegalSection>

      <LegalSection id="rights" title="User Rights">
        <p>Users may:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Request access to their data</li>
          <li>Request correction</li>
          <li>Request deletion</li>
          <li>Withdraw consent where applicable</li>
          <li>Contact us regarding privacy concerns</li>
        </ul>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about this policy? Email{" "}
          <a
            href="mailto:vednixtechnology@gmail.com"
            className="text-emerald hover:underline"
          >
            vednixtechnology@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
