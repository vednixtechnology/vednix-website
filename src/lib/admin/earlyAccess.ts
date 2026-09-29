import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { EarlyAccessUser } from "@/lib/admin/types";

const COLLECTION = "early_access_users";

function toEarlyAccessUser(
  id: string,
  data: Record<string, unknown>,
): EarlyAccessUser {
  return {
    id,
    fullName: (data.fullName as string) ?? "",
    email: (data.email as string) ?? "",
    phone: (data.phone as string) ?? "",
    occupation: (data.occupation as string) ?? "",
    city: (data.city as string) ?? "",
    createdAt: (data.createdAt as EarlyAccessUser["createdAt"]) ?? null,
  };
}

export async function listEarlyAccessUsers(): Promise<EarlyAccessUser[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc"),
    limit(1000),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toEarlyAccessUser(d.id, d.data()));
}

export async function deleteEarlyAccessUser(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
