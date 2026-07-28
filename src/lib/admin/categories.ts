import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BlogCategory } from "@/lib/admin/types";
import { slugify } from "@/lib/admin/blogs";

const CATEGORIES_COLLECTION = "categories";

export async function listCategories(): Promise<BlogCategory[]> {
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("name"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    name: d.data().name as string,
    slug: d.data().slug as string,
  }));
}

/** Creates a category if a matching name doesn't already exist (case-insensitive). */
export async function ensureCategory(name: string): Promise<BlogCategory> {
  const trimmed = name.trim();
  const existing = await listCategories();
  const match = existing.find(
    (c) => c.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (match) return match;

  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    name: trimmed,
    slug: slugify(trimmed),
  });
  return { id: docRef.id, name: trimmed, slug: slugify(trimmed) };
}
