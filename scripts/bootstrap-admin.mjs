#!/usr/bin/env node
/**
 * One-time bootstrap script for the Vednix admin CMS.
 *
 * Creates (or updates) a Firebase Authentication user and writes the
 * matching `admins/{uid}` Firestore document that grants them access to
 * /admin. Run this ONCE to create your first super admin, then rely on the
 * Admin Dashboard (or this script again) for any further admins.
 *
 * Requirements:
 *   1. Firebase Console -> Project Settings -> Service Accounts
 *      -> Generate new private key -> save as ./serviceAccountKey.json
 *      (already gitignored — never commit this file)
 *   2. Enable Email/Password sign-in: Firebase Console -> Authentication
 *      -> Sign-in method -> Email/Password -> Enable
 *
 * Usage:
 *   node scripts/bootstrap-admin.mjs --email=you@vednix.com --password=A-Strong-Password1 --role=super_admin
 *
 * After you've created your first admin, DELETE or stop using this script
 * for routine access — manage day-to-day admins via Firestore directly, or
 * wait for the future "invite admin" flow in Website Settings.
 */

import { readFileSync, existsSync } from "node:fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function parseArgs() {
  const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const [key, ...rest] = arg.replace(/^--/, "").split("=");
      return [key, rest.join("=")];
    }),
  );
  if (!args.email || !args.password) {
    console.error(
      "Usage: node scripts/bootstrap-admin.mjs --email=you@vednix.com --password=YourPassword --role=super_admin",
    );
    process.exit(1);
  }
  if (args.password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }
  return {
    email: args.email,
    password: args.password,
    role: args.role === "editor" ? "editor" : "super_admin",
  };
}

function loadServiceAccount() {
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccountKey.json";
  if (!existsSync(path)) {
    console.error(
      `Service account key not found at "${path}".\n` +
        "Download it from Firebase Console -> Project Settings -> Service Accounts\n" +
        "-> Generate new private key, and save it at that path.",
    );
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

async function main() {
  const { email, password, role } = parseArgs();
  const serviceAccount = loadServiceAccount();

  initializeApp({ credential: cert(serviceAccount) });
  const auth = getAuth();
  const db = getFirestore();

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    await auth.updateUser(userRecord.uid, { password });
    console.log(`Existing Firebase Auth user found (${userRecord.uid}) — password updated.`);
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err;
    userRecord = await auth.createUser({ email, password, emailVerified: true });
    console.log(`Created new Firebase Auth user (${userRecord.uid}).`);
  }

  await db.collection("admins").doc(userRecord.uid).set(
    {
      email,
      role,
      createdAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  console.log(`\n✅ ${email} can now sign in at /admin/login as "${role}".`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Bootstrap failed:", err);
  process.exit(1);
});
