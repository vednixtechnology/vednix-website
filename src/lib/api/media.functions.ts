import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { verifyAdmin } from "@/lib/firebaseAdmin.server";
import {
  createUploadSignature,
  destroyCloudinaryAsset,
} from "@/lib/cloudinary.server";

const folderSchema = z.enum([
  "blogs",
  "careers",
  "press",
  "updates",
  "website",
]);

/** Returns a short-lived signed-upload payload the client POSTs directly to
 * Cloudinary. Requires a valid admin session — the Cloudinary API secret
 * itself never leaves the server. */
export const getUploadSignature = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      idToken: z.string().min(1),
      folder: folderSchema,
      publicId: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    await verifyAdmin(data.idToken);
    return createUploadSignature({
      folder: data.folder,
      publicId: data.publicId,
    });
  });

/** Permanently deletes a Cloudinary asset. Admin-only, server-side signed
 * request — the only way to actually delete a file from Cloudinary storage. */
export const deleteCloudinaryImage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      idToken: z.string().min(1),
      publicId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    await verifyAdmin(data.idToken);
    await destroyCloudinaryAsset(data.publicId);
    return { success: true as const };
  });
