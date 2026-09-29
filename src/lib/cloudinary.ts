/**
 * Client-side Cloudinary integration.
 *
 * Uploads are SIGNED: the client asks the server (getUploadSignature, in
 * src/lib/api/media.functions.ts) for a short-lived signature, then POSTs
 * the file straight to Cloudinary with that signature. The Cloudinary API
 * secret lives only in src/lib/cloudinary.server.ts and is never sent to
 * the browser.
 *
 * Server-side env vars required (see .env.example):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * All three are read only inside server functions/handlers.
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  deleteCloudinaryImage,
  getUploadSignature,
} from "@/lib/api/media.functions";

export type CloudinaryFolder =
  | "blogs"
  | "careers"
  | "press"
  | "updates"
  | "website";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

async function requireAdminIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in as an admin to manage images.");
  }
  return user.getIdToken();
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImageToCloudinary(
  file: File,
  folder: CloudinaryFolder,
  options?: { replacePublicId?: string },
): Promise<CloudinaryUploadResult> {
  // Validate file size and format before initiating upload
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds maximum allowed size of 10MB.");
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      "Unsupported file format. Only JPEG, PNG, and WebP images are allowed.",
    );
  }

  const idToken = await requireAdminIdToken();

  const signed = await getUploadSignature({
    data: { idToken, folder, publicId: options?.replacePublicId },
  });

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signed.apiKey);
  formData.append("timestamp", String(signed.timestamp));
  formData.append("signature", signed.signature);
  formData.append("folder", signed.folder);
  if (signed.publicId) {
    formData.append("public_id", signed.publicId);
    formData.append("overwrite", "true");
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.error?.message ?? "Image upload to Cloudinary failed.",
    );
  }

  const data = await response.json();
  const result: CloudinaryUploadResult = {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
  };

  // Index write for the Media Library. If write fails, attempt to delete
  // the uploaded asset from Cloudinary to prevent unindexed orphan assets.
  if (!options?.replacePublicId) {
    try {
      await addDoc(collection(db, "media"), {
        ...result,
        folder,
        uploadedBy: auth.currentUser?.uid ?? null,
        uploadedByEmail: auth.currentUser?.email ?? null,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to index media upload in database", err);
      try {
        await deleteCloudinaryImage({
          data: { idToken, publicId: result.publicId },
        });
      } catch (cleanupErr) {
        console.error(
          "Failed to clean up unindexed Cloudinary asset",
          cleanupErr,
        );
      }
      throw new Error(
        "Media index creation failed in database. Upload was rolled back.",
      );
    }
  }

  return result;
}

/** Replaces an existing Cloudinary asset in place (same public_id), so
 * every reference to its URL elsewhere in the CMS keeps working — the
 * same secure_url now serves the new image. */
export async function replaceImageInCloudinary(
  oldPublicId: string,
  file: File,
  folder: CloudinaryFolder,
): Promise<CloudinaryUploadResult> {
  return uploadImageToCloudinary(file, folder, {
    replacePublicId: oldPublicId,
  });
}

/** Permanently deletes an asset from Cloudinary via a signed, admin-only
 * server request, then removes its Media Library index entry (if any). */
export async function deleteImageFromCloudinary(
  publicId: string,
  mediaDocId?: string,
): Promise<void> {
  const idToken = await requireAdminIdToken();
  await deleteCloudinaryImage({ data: { idToken, publicId } });
  if (mediaDocId) {
    await deleteDoc(doc(db, "media", mediaDocId));
  }
}
