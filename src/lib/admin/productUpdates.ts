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
import { slugify } from "@/lib/admin/blogs";
import type {
  ProductUpdate,
  ProductUpdateInput,
  PublishStatus,
} from "@/lib/admin/types";

const COLLECTION = "productUpdates";

function toProductUpdate(
  id: string,
  data: Record<string, unknown>,
): ProductUpdate {
  return {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? "",
    version: (data.version as string) ?? "",
    releaseDate: (data.releaseDate as Timestamp) ?? null,
    content: (data.content as string) ?? "",
    coverImageUrl: (data.coverImageUrl as string | null) ?? null,
    seoTitle: (data.seoTitle as string) ?? "",
    seoDescription: (data.seoDescription as string) ?? "",
    canonicalUrl: (data.canonicalUrl as string) ?? "",
    status: ((data.status as PublishStatus) ?? "draft") as PublishStatus,
    createdAt: (data.createdAt as Timestamp) ?? null,
    updatedAt: (data.updatedAt as Timestamp) ?? null,
    createdBy: (data.createdBy as string) ?? null,
    updatedBy: (data.updatedBy as string) ?? null,
  };
}

export { slugify };

export async function listAdminUpdates(): Promise<ProductUpdate[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("updatedAt", "desc"),
    limit(500),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProductUpdate(d.id, d.data()));
}

export async function listPublishedUpdates(): Promise<ProductUpdate[]> {
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "published"),
    orderBy("releaseDate", "desc"),
    limit(200),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProductUpdate(d.id, d.data()));
}

export async function getUpdateById(id: string): Promise<ProductUpdate | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return toProductUpdate(snap.id, snap.data());
}

export async function getPublishedUpdateBySlug(
  slug: string,
): Promise<ProductUpdate | null> {
  const q = query(
    collection(db, COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toProductUpdate(snap.docs[0].id, snap.docs[0].data());
}

export async function isUpdateSlugTaken(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION),
    where("slug", "==", slug),
    limit(5),
  );
  const snap = await getDocs(q);
  return snap.docs.some((d) => d.id !== excludeId);
}

export async function createUpdate(
  input: ProductUpdateInput,
  uid: string,
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    releaseDate: input.releaseDate
      ? Timestamp.fromDate(input.releaseDate)
      : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  });
  return docRef.id;
}

export async function updateUpdate(
  id: string,
  input: Partial<ProductUpdateInput>,
  uid: string,
): Promise<void> {
  const { releaseDate, ...rest } = input;
  await updateDoc(doc(db, COLLECTION, id), {
    ...rest,
    ...(releaseDate !== undefined
      ? { releaseDate: releaseDate ? Timestamp.fromDate(releaseDate) : null }
      : {}),
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function deleteUpdate(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
