import { addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export type SubmissionKind =
  | "contact_messages"
  | "early_access_users"
  | "newsletter_subscribers"
  | "career_applications";

export async function save(
  kind: SubmissionKind,
  data: Record<string, unknown>
) {
  await addDoc(collection(db, kind), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function saveCareerApplication(data: Record<string, unknown>) {
  await addDoc(collection(db, "career_applications"), {
    ...data,
    status: "new",
    source: "website",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/** Returns true if email already exists in the given collection */
export async function emailExists(
  kind: SubmissionKind,
  email: string
): Promise<boolean> {
  const q = query(
    collection(db, kind),
    where("email", "==", email.toLowerCase().trim())
  );
  const snap = await getDocs(q);
  return !snap.empty;
}
