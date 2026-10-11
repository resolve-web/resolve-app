import { describe, expect, it, vi } from "vitest";

import {
  FALLBACK_INDEXER_ORIGIN,
  PUBLIC_INDEXER_ORIGIN,
  fetchIndexerWithFallback,
  resolveIndexerOrigin,
  resolveIndexerOrigins,
} from "../src/lib/indexer-endpoint";

describe("resolveIndexerOrigin", () => {
  it("keeps an absolute browser configuration", () => {
    expect(resolveIndexerOrigin("https://example.com/", "")).toBe(
      "https://example.com",
    );
  });

  it("uses the public service for the same-origin browser proxy", () => {
    expect(resolveIndexerOrigin("/api/indexer", "")).toBe(
      PUBLIC_INDEXER_ORIGIN,
    );
  });

  it("allows a server-only health origin override", () => {
    expect(
      resolveIndexerOrigin("/api/indexer", "https://private-indexer.test/"),
    ).toBe("https://private-indexer.test");
  });
});

describe("resolveIndexerOrigins", () => {
  it("returns the public primary and fallback services", () => {
    expect(resolveIndexerOrigins("/api/indexer", "", "")).toEqual([
      PUBLIC_INDEXER_ORIGIN,
      FALLBACK_INDEXER_ORIGIN,
    ]);
  });

  it("de-duplicates an explicit fallback origin", () => {
    expect(
      resolveIndexerOrigins(
        "/api/indexer",
        "https://private-indexer.test/",
        "https://private-indexer.test/",
      ),
    ).toEqual(["https://private-indexer.test"]);
  });
});

describe("fetchIndexerWithFallback", () => {
  it("uses the fallback after a retryable upstream response", async () => {
    const calls: string[] = [];
    const fetcher = (async (url: string | URL | Request) => {
      calls.push(String(url));
      return new Response(null, { status: calls.length === 1 ? 503 : 200 });
    }) as typeof fetch;

    const result = await fetchIndexerWithFallback(
      "/ready",
      {},
      ["https://primary.test", "https://fallback.test"],
      fetcher,
    );

    expect(result.origin).toBe("https://fallback.test");
    expect(result.response.status).toBe(200);
    expect(calls).toEqual([
      "https://primary.test/ready",
      "https://fallback.test/ready",
    ]);
  });

  it("does not retry an authoritative client error", async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 404 }));

    const result = await fetchIndexerWithFallback(
      "/markets/404",
      {},
      ["https://primary.test", "https://fallback.test"],
      fetcher,
    );

    expect(result.origin).toBe("https://primary.test");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
