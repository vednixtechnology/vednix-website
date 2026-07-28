import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import type { ActivityLogEntry } from "@/lib/admin/types";

/**
 * Records an admin action to the `activityLogs` collection.
 * Never throws — a logging failure should never block the admin's action.
 */
export async function logActivity(action: string, summary: string) {
  const user = auth.currentUser;
  try {
    await addDoc(collection(db, "activityLogs"), {
      action,
      summary,
      actorEmail: user?.email ?? "unknown",
      actorUid: user?.uid ?? "unknown",
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to write activity log", err);
  }
}

export async function listActivityLogs(): Promise<ActivityLogEntry[]> {
  const q = query(
    collection(db, "activityLogs"),
    orderBy("createdAt", "desc"),
    limit(500),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      action: (data.action as string) ?? "",
      summary: (data.summary as string) ?? "",
      actorEmail: (data.actorEmail as string) ?? "",
      actorUid: (data.actorUid as string) ?? "",
      createdAt: (data.createdAt as ActivityLogEntry["createdAt"]) ?? null,
    };
  });
}
