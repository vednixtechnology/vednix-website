import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MediaAsset } from "@/lib/admin/types";

const COLLECTION = "media";

function toMediaAsset(id: string, data: Record<string, unknown>): MediaAsset {
  return {
    id,
    url: (data.url as string) ?? "",
    publicId: (data.publicId as string) ?? "",
    folder: (data.folder as string) ?? "website",
    width: (data.width as number) ?? 0,
    height: (data.height as number) ?? 0,
    format: (data.format as string) ?? "",
    bytes: (data.bytes as number) ?? 0,
    uploadedByEmail: (data.uploadedByEmail as string | null) ?? null,
    createdAt: (data.createdAt as MediaAsset["createdAt"]) ?? null,
  };
}

export async function listMedia(): Promise<MediaAsset[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc"),
    limit(1000),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toMediaAsset(d.id, d.data()));
}

/** Removes the asset from the Media Library index only — call this after
 * a successful Cloudinary deletion, not on its own (see
 * deleteImageFromCloudinary in src/lib/cloudinary.ts, which does both). */
export async function removeMediaRecord(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/** Updates an asset's cached metadata (dimensions/format/size) after a
 * Replace operation — the doc ID, URL, and publicId stay the same. */
export async function updateMediaRecord(
  id: string,
  patch: Partial<Pick<MediaAsset, "width" | "height" | "format" | "bytes">>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), patch);
}
