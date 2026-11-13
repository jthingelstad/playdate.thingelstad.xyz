// How each published file is typed and cached. Pure, so tests can hold it.
import { createHash } from "node:crypto";
import path from "node:path";

export const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const PAGE = "public, max-age=0, s-maxage=60, must-revalidate";

export function cacheControl(key) {
  const extension = path.extname(key);
  if (key.startsWith("fonts/") || key.startsWith("shared/fonts/"))
    return "public, max-age=2592000";
  if (
    [".html", ".txt", ".xml", ".css"].includes(extension) ||
    key === "revision.json"
  )
    return PAGE;
  // Screens and art can be redrawn under the same name as the game changes.
  return "public, max-age=86400";
}

export function publicationOrder(files) {
  return [...files].sort(
    (a, b) =>
      Number(a.endsWith(".html")) - Number(b.endsWith(".html")) ||
      a.localeCompare(b),
  );
}

// Stored as built, never pre-compressed: CloudFront compresses per request.
export function prepareObject(key, bytes) {
  if (
    key.startsWith("/") ||
    key.split("/").includes("..") ||
    key.includes("\\")
  )
    throw new Error(`Unsafe public key: ${key}`);
  const type = mime[path.extname(key)];
  if (!type) throw new Error(`No MIME type for ${key}`);
  return {
    Body: bytes,
    ContentType: type,
    CacheControl: cacheControl(key),
    Metadata: { sha256: createHash("sha256").update(bytes).digest("hex") },
  };
}
