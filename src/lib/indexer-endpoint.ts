export const PUBLIC_INDEXER_ORIGIN = "https://resolve-indexer.onrender.com";
export const FALLBACK_INDEXER_ORIGIN =
  "https://resolve-indexer-r4fs.onrender.com";

const RETRYABLE_STATUS_CODES = new Set([408, 425, 429]);

function cleanOrigin(value: string | undefined): string {
  return (value ?? "").trim().replace(/\/$/, "");
}

/**
 * Browser clients may use the same-origin `/api/indexer` proxy. Server-side
 * health checks need an absolute URL, so relative values resolve to the public
 * Render service (or an explicit private origin when one is configured).
 */
export function resolveIndexerOrigin(
  configuredUrl: string,
  serverOrigin = process.env.INDEXER_API_URL,
): string {
  const value = cleanOrigin(configuredUrl);
  if (/^https?:\/\//i.test(value)) return value;

  const explicitOrigin = cleanOrigin(serverOrigin);
  return explicitOrigin || PUBLIC_INDEXER_ORIGIN;
}

/** Return the ordered, de-duplicated upstreams used by server-side requests. */
export function resolveIndexerOrigins(
  configuredUrl: string,
  serverOrigin = process.env.INDEXER_API_URL,
  serverFallbackOrigin = process.env.INDEXER_FALLBACK_API_URL,
): string[] {
  const primary = resolveIndexerOrigin(configuredUrl, serverOrigin);
  const fallback = cleanOrigin(serverFallbackOrigin) || FALLBACK_INDEXER_ORIGIN;
  return [...new Set([primary, fallback].filter(Boolean))];
}

export type IndexerFetchResult = {
  origin: string;
  response: Response;
};

/**
 * Try indexer upstreams in order. Client errors are authoritative, while
 * network errors, rate limits, timeouts, and server errors fail over.
 */
export async function fetchIndexerWithFallback(
  path: string,
  init: RequestInit = {},
  origins = resolveIndexerOrigins("/api/indexer"),
  fetcher: typeof fetch = fetch,
): Promise<IndexerFetchResult> {
  const requestInit: RequestInit = { ...init, signal: undefined };
  let lastResponse: IndexerFetchResult | undefined;
  let lastError: unknown;

  for (const origin of origins) {
    try {
      const response = await fetcher(`${origin}${path}`, {
        ...requestInit,
        signal: AbortSignal.timeout(8000),
      });
      const result = { origin, response };
      if (
        response.status < 500 &&
        !RETRYABLE_STATUS_CODES.has(response.status)
      ) {
        return result;
      }
      lastResponse = result;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastResponse) return lastResponse;
  throw lastError instanceof Error
    ? lastError
    : new Error("All indexer upstreams are unavailable");
}
