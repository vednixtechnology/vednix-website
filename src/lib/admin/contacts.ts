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
import type { ContactMessage, ContactStatus } from "@/lib/admin/types";

const COLLECTION = "contact_messages";

function toContactMessage(
  id: string,
  data: Record<string, unknown>,
): ContactMessage {
  return {
    id,
    fullName: (data.fullName as string) ?? "",
    email: (data.email as string) ?? "",
    phone: (data.phone as string) ?? "",
    subject: (data.subject as string) ?? "",
    message: (data.message as string) ?? "",
    status: ((data.status as ContactStatus) ?? "new") as ContactStatus,
    notes: (data.notes as string) ?? "",
    createdAt: (data.createdAt as ContactMessage["createdAt"]) ?? null,
  };
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc"),
    limit(500),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toContactMessage(d.id, d.data()));
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { status });
}

export async function updateContactNotes(
  id: string,
  notes: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { notes });
}

export async function deleteContactMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
