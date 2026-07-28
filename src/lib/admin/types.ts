import type { Timestamp } from "firebase/firestore";

export type AdminRole = "super_admin" | "editor";

export interface AdminRecord {
  uid: string;
  email: string;
  role: AdminRole;
  createdAt: Timestamp | null;
}

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // sanitized HTML from the rich text editor
  category: string;
  tags: string[];
  author: string;
  status: BlogStatus;
  coverImageUrl: string | null;
  ogImageUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  readingTimeMinutes: number;
  publishDate: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export type BlogInput = Omit<
  BlogPost,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "publishDate"
> & {
  publishDate: Date | null;
};

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string; // e.g. "blog.published"
  summary: string; // human readable, e.g. "Published blog \"Why Money...\""
  actorEmail: string;
  actorUid: string;
  createdAt: Timestamp | null;
}

export type ContactStatus = "new" | "in_progress" | "resolved";

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  notes: string;
  createdAt: Timestamp | null;
}

export interface EarlyAccessUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  occupation: string;
  city: string;
  createdAt: Timestamp | null;
}
export type PublishStatus = "draft" | "published";

export interface ProductUpdate {
  id: string;
  title: string;
  slug: string;
  version: string;
  releaseDate: Timestamp | null;
  content: string;
  coverImageUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  status: PublishStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export type ProductUpdateInput = Omit<
  ProductUpdate,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "releaseDate"
> & { releaseDate: Date | null };

export interface PressRelease {
  id: string;
  title: string;
  slug: string;
  publishDate: Timestamp | null;
  content: string;
  coverImageUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  status: PublishStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export type PressReleaseInput = Omit<
  PressRelease,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy" | "publishDate"
> & { publishDate: Date | null };

export interface MediaAsset {
  id: string;
  url: string;
  publicId: string;
  folder: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  uploadedByEmail: string | null;
  createdAt: Timestamp | null;
}

export interface WebsiteSettings {
  companyName: string;
  logoUrl: string;
  faviconUrl: string;
  heroBannerUrl: string;
  announcementBarText: string;
  announcementBarEnabled: boolean;
  footerText: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  contactPhoneAlt: string;
  googleMapsUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  githubUrl: string;
  youtubeUrl: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoDefaultKeywords: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  defaultOgImageUrl: string;
  robotsTxt: string;
  sitemapEnabled: boolean;
  updatedAt: Timestamp | null;
  updatedBy: string | null;
}

export type WebsiteSettingsInput = Omit<
  WebsiteSettings,
  "updatedAt" | "updatedBy"
>;

export interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: Timestamp | null;
}

export type JobStatus = "open" | "closed";
export type BadgeColor = "emerald" | "electric";

export interface CareerJob {
  id: string;
  title: string;
  department: string; // shown as the badge pill, e.g. "Engineering"
  badgeColor: BadgeColor;
  iconKey: string; // key into ICONS_BY_KEY in the careers page
  location: string; // e.g. "Remote / Hybrid"
  employmentType: string; // e.g. "Internship", "Full-time"
  experience: string; // e.g. "0-1 years", "Entry-level"
  duration: string; // e.g. "2-6 months"
  overview: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
  salary: string | null;
  applyLink: string | null; // if empty, applies via internal /career-apply
  status: JobStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  createdBy: string | null;
  updatedBy: string | null;
}

export type CareerJobInput = Omit<
  CareerJob,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
>;

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface CareerApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  resumeLink: string;
  status: ApplicationStatus;
  notes: string;
  createdAt: Timestamp | null;
  raw: Record<string, unknown>; // every field submitted (year, availability, etc.)
}
