import { existsSync, readFileSync } from "node:fs";
import admin from "firebase-admin";

/**
 * Required env var (server-only): FIREBASE_SERVICE_ACCOUNT_KEY
 * The full JSON content of a Firebase service account key, as a single-line
 * string (Firebase Console -> Project Settings -> Service Accounts ->
 * Generate new private key). Used only in server functions — never sent to
 * the client.
 */
function getAdminApp() {
  const existing = admin.apps;
  if (existing.length && existing[0]) return existing[0];

  let raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    if (existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      raw = readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8");
    }
  }
  // Local filesystem fallback is strictly development/test-only
  if (!raw && process.env.NODE_ENV !== "production") {
    const localFallback = "./serviceAccountKey.json";
    if (existsSync(localFallback)) {
      raw = readFileSync(localFallback, "utf8");
    }
  }

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

  return admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

import type { AdminRole } from "@/lib/admin/types";

/** Verifies a Firebase ID token and confirms the user is a listed admin with a valid role.
 * Throws (with a client-safe message) if either check fails. */
export async function verifyAdmin(
  idToken: string,
): Promise<{ uid: string; email: string; role: AdminRole }> {
  if (!idToken) {
    throw new Error("You must be signed in as an admin for this action.");
  }

  const app = getAdminApp();
  let decoded;
  try {
    decoded = await admin.auth(app).verifyIdToken(idToken);
  } catch {
    throw new Error("Your session has expired — please sign in again.");
  }

  const projectId =
    app.options.projectId ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.VITE_FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error("This account is not authorized to perform admin actions.");
  }

  let rawRole: string | undefined;
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/admins/${encodeURIComponent(decoded.uid)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        "This account is not authorized to perform admin actions.",
      );
    }

    const docData = (await response.json()) as {
      fields?: {
        role?: { stringValue?: string };
      };
    };

    rawRole = docData.fields?.role?.stringValue;
  } catch (err) {
    if (
      err instanceof Error &&
      err.message === "This account is not authorized to perform admin actions."
    ) {
      throw err;
    }
    throw new Error(
      "This account is not authorized to perform admin actions.",
    );
  }

  if (rawRole !== "super_admin" && rawRole !== "editor") {
    throw new Error("This account does not have a recognized admin role.");
  }

  return { uid: decoded.uid, email: decoded.email ?? "", role: rawRole };
}

/** Verifies that the signed-in admin holds the 'super_admin' role. */
export async function verifySuperAdmin(
  idToken: string,
): Promise<{ uid: string; email: string; role: "super_admin" }> {
  const admin = await verifyAdmin(idToken);
  if (admin.role !== "super_admin") {
    throw new Error("This action requires super admin privileges.");
  }
  return { ...admin, role: "super_admin" };
}
