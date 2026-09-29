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
import type { ApplicationStatus, CareerApplication } from "@/lib/admin/types";

const COLLECTION = "career_applications";

function toApplication(
  id: string,
  data: Record<string, unknown>,
): CareerApplication {
  return {
    id,
    fullName: (data.fullName as string) ?? "",
    email: (data.email as string) ?? "",
    phone: (data.phone as string) ?? "",
    position: (data.position as string) ?? "",
    resumeLink: (data.resumeLink as string) ?? "",
    status: ((data.status as ApplicationStatus) ?? "new") as ApplicationStatus,
    notes: (data.notes as string) ?? "",
    createdAt: (data.createdAt as CareerApplication["createdAt"]) ?? null,
    raw: data,
  };
}

export async function listApplications(): Promise<CareerApplication[]> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc"),
    limit(500),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toApplication(d.id, d.data()));
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { status });
}

export async function updateApplicationNotes(
  id: string,
  notes: string,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { notes });
}

export async function deleteApplication(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
