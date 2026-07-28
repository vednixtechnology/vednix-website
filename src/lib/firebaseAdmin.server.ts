import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Required env var (server-only): FIREBASE_SERVICE_ACCOUNT_KEY
 * The full JSON content of a Firebase service account key, as a single-line
 * string (Firebase Console -> Project Settings -> Service Accounts ->
 * Generate new private key). Used only in server functions — never sent to
 * the client.
 */
function getAdminApp() {
  const existing = getApps();
  if (existing.length) return existing[0];

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set on the server. See CMS-SETUP.md.",
    );
  }

  let serviceAccount: Record<string, unknown>;
  try {
    serviceAccount = JSON.parse(raw);
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON — copy the full key file contents exactly.",
    );
  }

  return initializeApp({ credential: cert(serviceAccount) });
}

/** Verifies a Firebase ID token and confirms the user is a listed admin.
 * Throws (with a client-safe message) if either check fails. */
export async function verifyAdmin(
  idToken: string,
): Promise<{ uid: string; email: string }> {
  if (!idToken) {
    throw new Error("You must be signed in as an admin for this action.");
  }

  const app = getAdminApp();
  let decoded;
  try {
    decoded = await getAuth(app).verifyIdToken(idToken);
  } catch {
    throw new Error("Your session has expired — please sign in again.");
  }

  const adminDoc = await getFirestore(app)
    .collection("admins")
    .doc(decoded.uid)
    .get();

  if (!adminDoc.exists) {
    throw new Error("This account is not authorized to perform admin actions.");
  }

  return { uid: decoded.uid, email: decoded.email ?? "" };
}
