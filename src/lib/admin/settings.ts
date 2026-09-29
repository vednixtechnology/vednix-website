import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { WebsiteSettings, WebsiteSettingsInput } from "@/lib/admin/types";

const DOC_PATH = ["websiteSettings", "main"] as const;

/** These defaults mirror the exact content that used to be hardcoded in
 * Navbar/Footer/root SEO. They're the fallback whenever a field hasn't
 * been set in Firestore yet, which is what guarantees zero visual change
 * on the live site until an admin actually edits something here. */
export const DEFAULT_SETTINGS: WebsiteSettingsInput = {
  companyName: "Vednix Technology",
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
  heroBannerUrl: "",
  announcementBarText: "",
  announcementBarEnabled: false,
  footerText:
    "Vednix Technology is building innovative financial technology solutions designed to simplify finance and improve financial behaviour through intelligent digital experiences.",
  address: "187 Dudhia, Indore, Madhya Pradesh — 452001",
  contactEmail: "vednixtechnology@gmail.com",
  contactPhone: "+91 90394 62506",
  contactPhoneAlt: "+91 91310 60960",
  googleMapsUrl: "",
  linkedinUrl: "https://www.linkedin.com/company/vednix-technology/",
  instagramUrl: "https://www.instagram.com/vednix_technology_pvt_ltd",
  twitterUrl: "",
  githubUrl: "",
  youtubeUrl: "",
  privacyPolicyUrl: "/privacy",
  termsUrl: "/terms",
  seoDefaultTitle:
    "Vednix Technology — Building Intelligent Financial Infrastructure",
  seoDefaultDescription:
    "Vednix Technology is a fintech company building intelligent financial infrastructure powered by AI and behavioural innovation. SmartPocket is our flagship product.",
  seoDefaultKeywords: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  defaultOgImageUrl:
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4a1a28b2-b950-44af-81c1-16dc19cbc7f8/id-preview-f2e0403f--ee846189-c04d-4d38-ab66-9ad1dc7f28a4.lovable.app-1781658337875.png",
  robotsTxt: "User-agent: *\nAllow: /",
  sitemapEnabled: true,
};

/** These settings now drive the live Navbar, Footer, and root SEO
 * defaults (see useWebsiteSettings() and __root.tsx / Navbar.tsx /
 * Footer.tsx). Every field falls back to DEFAULT_SETTINGS above, so an
 * empty/missing Firestore doc renders identically to the original
 * hardcoded site. */
export async function getWebsiteSettings(): Promise<WebsiteSettings> {
  const snap = await getDoc(doc(db, ...DOC_PATH));
  if (!snap.exists()) {
    return { ...DEFAULT_SETTINGS, updatedAt: null, updatedBy: null };
  }
  const data = snap.data();
  // Ensure all values are JSON/Seroval-serializable so SSR hydration never fails
  const rawUpdatedAt = data.updatedAt;
  const updatedAt =
    rawUpdatedAt && typeof rawUpdatedAt.toDate === "function"
      ? (rawUpdatedAt.toDate().toISOString() as string)
      : typeof rawUpdatedAt === "string"
        ? rawUpdatedAt
        : null;

  return {
    ...DEFAULT_SETTINGS,
    ...data,
    updatedAt,
    updatedBy: typeof data.updatedBy === "string" ? data.updatedBy : null,
  };
}

export async function updateWebsiteSettings(
  input: WebsiteSettingsInput,
  uid: string,
): Promise<void> {
  await setDoc(
    doc(db, ...DOC_PATH),
    { ...input, updatedAt: serverTimestamp(), updatedBy: uid },
    { merge: true },
  );
}
