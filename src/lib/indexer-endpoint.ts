export const PUBLIC_INDEXER_ORIGIN = "https://resolve-indexer.onrender.com";

/**
 * Browser clients may use the same-origin `/api/indexer` proxy. Server-side
 * health checks need an absolute URL, so relative values resolve to the public
 * Render service (or an explicit private origin when one is configured).
 */
export function resolveIndexerOrigin(
  configuredUrl: string,
  serverOrigin = process.env.INDEXER_API_URL,
): string {
  const value = configuredUrl.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(value)) return value;

  const explicitOrigin = serverOrigin?.trim().replace(/\/$/, "");
  return explicitOrigin || PUBLIC_INDEXER_ORIGIN;
}
