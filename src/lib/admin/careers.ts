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
import type { CareerJob, CareerJobInput, JobStatus } from "@/lib/admin/types";

const CAREERS_COLLECTION = "careers";

function toCareerJob(id: string, data: Record<string, unknown>): CareerJob {
  return {
    id,
    title: (data.title as string) ?? "",
    department: (data.department as string) ?? "",
    badgeColor: (data.badgeColor as "emerald" | "electric") ?? "emerald",
    iconKey: (data.iconKey as string) ?? "briefcase",
    location: (data.location as string) ?? "",
    employmentType: (data.employmentType as string) ?? "Internship",
    experience: (data.experience as string) ?? "",
    duration: (data.duration as string) ?? "",
    overview: (data.overview as string) ?? "",
    responsibilities: (data.responsibilities as string[]) ?? [],
    requirements: (data.requirements as string[]) ?? [],
    preferred: (data.preferred as string[]) ?? [],
    salary: (data.salary as string | null) ?? null,
    applyLink: (data.applyLink as string | null) ?? null,
    status: ((data.status as JobStatus) ?? "open") as JobStatus,
    createdAt: (data.createdAt as Timestamp) ?? null,
    updatedAt: (data.updatedAt as Timestamp) ?? null,
    createdBy: (data.createdBy as string) ?? null,
    updatedBy: (data.updatedBy as string) ?? null,
  };
}

export async function listAdminJobs(): Promise<CareerJob[]> {
  const q = query(
    collection(db, CAREERS_COLLECTION),
    orderBy("updatedAt", "desc"),
    limit(500),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toCareerJob(d.id, d.data()));
}

/** Open jobs only, used by the public /careers page. */
export async function listOpenJobs(): Promise<CareerJob[]> {
  const q = query(
    collection(db, CAREERS_COLLECTION),
    where("status", "==", "open"),
    orderBy("updatedAt", "desc"),
    limit(200),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toCareerJob(d.id, d.data()));
}

export async function getJobById(id: string): Promise<CareerJob | null> {
  const snap = await getDoc(doc(db, CAREERS_COLLECTION, id));
  if (!snap.exists()) return null;
  return toCareerJob(snap.id, snap.data());
}

export async function createJob(
  input: CareerJobInput,
  uid: string,
): Promise<string> {
  const docRef = await addDoc(collection(db, CAREERS_COLLECTION), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: uid,
    updatedBy: uid,
  });
  return docRef.id;
}

export async function updateJob(
  id: string,
  input: Partial<CareerJobInput>,
  uid: string,
): Promise<void> {
  await updateDoc(doc(db, CAREERS_COLLECTION, id), {
    ...input,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function setJobStatus(
  id: string,
  status: JobStatus,
  uid: string,
): Promise<void> {
  await updateDoc(doc(db, CAREERS_COLLECTION, id), {
    status,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}

export async function deleteJob(id: string): Promise<void> {
  await deleteDoc(doc(db, CAREERS_COLLECTION, id));
}
