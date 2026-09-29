import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BlogInput, BlogPost, BlogStatus } from "@/lib/admin/types";

const BLOGS_COLLECTION = "blogs";

function toBlogPost(id: string, data: Record<string, unknown>): BlogPost {
  return {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    content: (data.content as string) ?? "",
    category: (data.category as string) ?? "Uncategorized",
    tags: (data.tags as string[]) ?? [],
    author: (data.author as string) ?? "Vednix Team",
    status: ((data.status as BlogStatus) ?? "draft") as BlogStatus,
    coverImageUrl: (data.coverImageUrl as string | null) ?? null,
    ogImageUrl: (data.ogImageUrl as string | null) ?? null,
    seoTitle: (data.seoTitle as string) ?? "",
    seoDescription: (data.seoDescription as string) ?? "",
    canonicalUrl: (data.canonicalUrl as string) ?? "",
    readingTimeMinutes: (data.readingTimeMinutes as number) ?? 1,
    publishDate: (data.publishDate as Timestamp) ?? null,
    createdAt: (data.createdAt as Timestamp) ?? null,
    updatedAt: (data.updatedAt as Timestamp) ?? null,
    createdBy: (data.createdBy as string) ?? null,
    updatedBy: (data.updatedBy as string) ?? null,
  };
}

/** Kebab-case slug generator, e.g. "Why Money Moves Slowly!" -> "why-money-moves-slowly" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** ~200 words/minute, stripped of HTML tags. Minimum of 1 minute. */
export function computeReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** All blogs, newest updated first — used by the admin list (client-side
 * search/filter/pagination on top of this, since the catalog size for a
 * company blog doesn't warrant a dedicated search index). */
export async function listAdminBlogs(): Promise<BlogPost[]> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    orderBy("updatedAt", "desc"),
    limit(500),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toBlogPost(d.id, d.data()));
}

/** Published blogs only, newest published first — used by the public /insights page. */
export async function listPublishedBlogs(): Promise<BlogPost[]> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where("status", "==", "published"),
    orderBy("publishDate", "desc"),
    limit(200),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toBlogPost(d.id, d.data()));
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  const snap = await getDoc(doc(db, BLOGS_COLLECTION, id));
  if (!snap.exists()) return null;
  return toBlogPost(snap.id, snap.data());
}

/** Used by the public /insights/:slug page — only returns published posts. */
export async function getPublishedBlogBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toBlogPost(snap.docs[0].id, snap.docs[0].data());
}

/** True if another blog already uses this slug (excluding `excludeId`, for edits). */
export async function isSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const q = query(
    collection(db, BLOGS_COLLECTION),
    where("slug", "==", slug),
    limit(5),
  );
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeId);
}

export async function createBlog(
  input: BlogInput,
  uid: string,
): Promise<string> {
  const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
    ...input,
    publishDate: input.publishDate
      ? Timestamp.fromDate(input.publishDate)
      : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  });
  return docRef.id;
}

export async function updateBlog(
  id: string,
  input: Partial<BlogInput>,
  uid: string,
): Promise<void> {
  const { publishDate, ...rest } = input;
  await updateDoc(doc(db, BLOGS_COLLECTION, id), {
    ...rest,
    ...(publishDate !== undefined
      ? { publishDate: publishDate ? Timestamp.fromDate(publishDate) : null }
      : {}),
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function setBlogStatus(
  id: string,
  status: BlogStatus,
  uid: string,
): Promise<void> {
  await updateDoc(doc(db, BLOGS_COLLECTION, id), {
    status,
    ...(status === "published" ? { publishDate: serverTimestamp() } : {}),
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function deleteBlog(id: string): Promise<void> {
  await deleteDoc(doc(db, BLOGS_COLLECTION, id));
}
