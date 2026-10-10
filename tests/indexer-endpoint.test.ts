import { describe, expect, it } from "vitest";

import {
  PUBLIC_INDEXER_ORIGIN,
  resolveIndexerOrigin,
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
