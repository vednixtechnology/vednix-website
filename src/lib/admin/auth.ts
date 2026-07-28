import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { AdminRecord } from "@/lib/admin/types";

/**
 * Signs an admin in with email + password.
 * Throws the underlying FirebaseError on failure (caller shows the message).
 */
export async function signInAdmin(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
  const admin = await getAdminRecord(credential.user.uid);
  if (!admin) {
    // Valid Firebase Auth user but not present in the `admins` collection.
    // Sign them back out immediately — they are not authorized for /admin.
    await firebaseSignOut(auth);
    throw new Error(
      "This account is not authorized to access the admin dashboard.",
    );
  }
  return admin;
}

export async function signOutAdmin() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("mock_admin");
  }
  await firebaseSignOut(auth);
}

/**
 * Looks up the `admins/{uid}` Firestore doc for a signed-in Firebase user.
 * Returns null if the user exists in Firebase Auth but is not an admin.
 */
export async function getAdminRecord(uid: string): Promise<AdminRecord | null> {
  const snap = await getDoc(doc(db, "admins", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    email: data.email,
    role: data.role,
    createdAt: data.createdAt ?? null,
  };
}

export type { User };
