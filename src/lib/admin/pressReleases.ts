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
import type {
  PressRelease,
  PressReleaseInput,
  PublishStatus,
} from "@/lib/admin/types";

const COLLECTION = "pressReleases";

function toPressRelease(
  id: string,
  data: Record<string, unknown>,
): PressRelease {
  return {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? "",
    publishDate: (data.publishDate as Timestamp) ?? null,
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

export async function listAdminPressReleases(): Promise<PressRelease[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("updatedAt", "desc"),
    limit(500),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPressRelease(d.id, d.data()));
}

export async function listPublishedPressReleases(): Promise<PressRelease[]> {
  const q = query(
    collection(db, COLLECTION),
    where("status", "==", "published"),
    orderBy("publishDate", "desc"),
    limit(200),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toPressRelease(d.id, d.data()));
}

export async function getPressReleaseById(
  id: string,
): Promise<PressRelease | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return toPressRelease(snap.id, snap.data());
}

export async function getPublishedPressReleaseBySlug(
  slug: string,
): Promise<PressRelease | null> {
  const q = query(
    collection(db, COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return toPressRelease(snap.docs[0].id, snap.docs[0].data());
}

export async function isPressSlugTaken(
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

export async function createPressRelease(
  input: PressReleaseInput,
  uid: string,
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
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

export async function updatePressRelease(
  id: string,
  input: Partial<PressReleaseInput>,
  uid: string,
): Promise<void> {
  const { publishDate, ...rest } = input;
  await updateDoc(doc(db, COLLECTION, id), {
    ...rest,
    ...(publishDate !== undefined
      ? { publishDate: publishDate ? Timestamp.fromDate(publishDate) : null }
      : {}),
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function deletePressRelease(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
