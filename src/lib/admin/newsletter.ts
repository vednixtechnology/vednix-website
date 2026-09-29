import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { NewsletterSubscriber } from "@/lib/admin/types";

const COLLECTION = "newsletter_subscribers";

function toSubscriber(
  id: string,
  data: Record<string, unknown>,
): NewsletterSubscriber {
  return {
    id,
    email: (data.email as string) ?? "",
    createdAt: (data.createdAt as NewsletterSubscriber["createdAt"]) ?? null,
  };
}

export async function listNewsletterSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  const q = query(
    collection(db, COLLECTION),
    orderBy("createdAt", "desc"),
    limit(2000),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toSubscriber(d.id, d.data()));
}

export async function deleteNewsletterSubscriber(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
