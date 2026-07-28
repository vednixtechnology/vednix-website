import crypto from "node:crypto";

/**
 * Server-only Cloudinary integration using the Admin API. The API secret
 * NEVER leaves this file — the client only ever receives a short-lived
 * signature, never the secret itself.
 *
 * Required env vars (server-only, do NOT prefix with VITE_):
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

function getCloudinaryServerConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, " +
        "CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET as environment variables.",
    );
  }
  return { cloudName, apiKey, apiSecret };
}

/** Cloudinary's signing rule: sort all params (except file/api_key/signature/
 * resource_type) alphabetically, join as key=value pairs, append the API
 * secret, then SHA-1 hash. Must match exactly what's later sent to Cloudinary. */
function signParams(
  params: Record<string, string | number | boolean>,
  apiSecret: string,
): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto
    .createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string | null;
}

/** Generates a signed-upload payload for the client to POST directly to
 * Cloudinary. If `publicId` is provided, the upload overwrites that asset
 * in place (used for "Replace"), which keeps the existing secure_url
 * working everywhere it's already referenced. */
export function createUploadSignature(input: {
  folder: string;
  publicId?: string;
}): UploadSignature {
  const { cloudName, apiKey, apiSecret } = getCloudinaryServerConfig();
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign: Record<string, string | number | boolean> = {
    timestamp,
    folder: input.folder,
  };
  if (input.publicId) {
    paramsToSign.public_id = input.publicId;
    paramsToSign.overwrite = true;
  }

  const signature = signParams(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder: input.folder,
    publicId: input.publicId ?? null,
  };
}

/** Permanently deletes an asset from Cloudinary storage via the signed
 * Admin API `destroy` endpoint. */
export async function destroyCloudinaryAsset(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryServerConfig();
  const timestamp = Math.round(Date.now() / 1000);
  const signature = signParams({ timestamp, public_id: publicId }, apiSecret);

  const form = new URLSearchParams();
  form.set("public_id", publicId);
  form.set("timestamp", String(timestamp));
  form.set("api_key", apiKey);
  form.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: "POST", body: form },
  );

  if (!response.ok) {
    throw new Error("Cloudinary rejected the deletion request.");
  }

  const data = await response.json();
  // Cloudinary returns { result: "ok" } on success, or "not found" if the
  // asset was already gone — both are acceptable outcomes for a delete.
  if (data.result !== "ok" && data.result !== "not found") {
    throw new Error(`Cloudinary deletion failed: ${data.result}`);
  }
}
