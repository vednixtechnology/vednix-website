import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { verifyAdmin, verifySuperAdmin } from "@/lib/firebaseAdmin.server";
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
 * Cloudinary. Both super_admin and editor roles can upload media for content. */
export const getUploadSignature = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      idToken: z.string().min(1),
      folder: folderSchema,
      publicId: z
        .string()
        .regex(/^[a-zA-Z0-9_\-/]+$/, "Invalid public ID format")
        .max(200)
        .optional(),
    }),
  )
  .handler(async ({ data }) => {
    await verifyAdmin(data.idToken);
    return createUploadSignature({
      folder: data.folder,
      publicId: data.publicId,
    });
  });

/** Permanently deletes a Cloudinary asset. Super-admin only, server-side signed
 * request — editors are forbidden from deleting Cloudinary assets. */
export const deleteCloudinaryImage = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      idToken: z.string().min(1),
      publicId: z
        .string()
        .min(1)
        .regex(/^[a-zA-Z0-9_\-/]+$/, "Invalid public ID format")
        .max(200),
    }),
  )
  .handler(async ({ data }) => {
    await verifySuperAdmin(data.idToken);
    await destroyCloudinaryAsset(data.publicId);
    return { success: true as const };
  });
