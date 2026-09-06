import { platformConfig } from "@/lib/platform-config";

export type StoredObject = {
  backend: "local_preview" | "s3";
  key: string;
  contentType: string;
  byteSize: number;
  connected: boolean;
};

const ALLOWED = new Set<string>([
  ...platformConfig.restaurantSettings.allowedDocumentTypes,
  ...platformConfig.restaurantSettings.allowedImageTypes,
]);

export function validateUpload(input: {
  contentType: string;
  byteSize: number;
  kind: "document" | "image";
}): { ok: true } | { ok: false; error: string } {
  const allowed =
    input.kind === "image"
      ? platformConfig.restaurantSettings.allowedImageTypes
      : platformConfig.restaurantSettings.allowedDocumentTypes;
  if (!allowed.includes(input.contentType as never) && !ALLOWED.has(input.contentType)) {
    return { ok: false, error: "This file type is not allowed." };
  }
  if (input.byteSize <= 0 || input.byteSize > platformConfig.restaurantSettings.maxUploadBytes) {
    return {
      ok: false,
      error: `File must be under ${Math.floor(platformConfig.restaurantSettings.maxUploadBytes / 1024)} KB.`,
    };
  }
  return { ok: true };
}

/**
 * Object storage adapter. S3 is NOT CONNECTED. Preview stores a metadata
 * record plus a truncated data URL in Postgres so documents have a status
 * without pretending a production bucket exists.
 */
export const storageAdapter = {
  connected: false as const,
  provider: "NOT_CONNECTED" as const,
  async put(input: {
    key: string;
    contentType: string;
    bytes: Uint8Array;
  }): Promise<StoredObject> {
    return {
      backend: "local_preview",
      key: input.key,
      contentType: input.contentType,
      byteSize: input.bytes.byteLength,
      connected: false,
    };
  },
};
