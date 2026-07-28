import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type SubmissionKind =
  | "contact_messages"
  | "early_access_users"
  | "newsletter_subscribers"
  | "career_applications";

export async function save(
  kind: SubmissionKind,
  data: Record<string, unknown>,
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

/** Returns true if email already exists in the given collection.
 *
 * NOTE: this runs a `list` query, which Firestore's security rules only
 * grant to admins (public users can only `create`, not bulk-read, these
 * collections). Use this only from admin-side code. For public-facing
 * duplicate checks, use `emailExistsByKey` / `saveWithEmailKey` below,
 * which only ever need a narrow single-document `get`. */
export async function emailExists(
  kind: SubmissionKind,
  email: string,
): Promise<boolean> {
  const q = query(
    collection(db, kind),
    where("email", "==", email.toLowerCase().trim()),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

/** Deterministic, URL-safe doc ID derived from an email address, so a
 * single-document `get` can check for duplicates without needing bulk
 * `list` access (see firestore.rules — these collections grant public
 * `get` but not `list`). */
function emailDocId(email: string): string {
  return encodeURIComponent(email.toLowerCase().trim());
}

/** Public-safe duplicate check: a single-document read, not a query. */
export async function emailExistsByKey(
  kind: SubmissionKind,
  email: string,
): Promise<boolean> {
  const snap = await getDoc(doc(db, kind, emailDocId(email)));
  return snap.exists();
}

/** Public-safe submission using the email as the document ID. Firestore
 * itself then refuses a second write to the same ID from a non-admin
 * (rules only allow `create`, not `update`, for these collections), which
 * backs up the client-side duplicate check with real enforcement. */
export async function saveWithEmailKey(
  kind: SubmissionKind,
  email: string,
  data: Record<string, unknown>,
) {
  await setDoc(doc(db, kind, emailDocId(email)), {
    ...data,
    email: email.toLowerCase().trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}
