import { describe, expect, it } from "vitest";
import { MarketStatus, Outcome, type Market } from "@resolve-protocol/sdk";

import { mapContractMarket } from "../src/lib/discovery";

describe("contract market discovery", () => {
  it("maps authoritative on-chain fields to the discovery view", () => {
    const market: Market = {
      id: 7n,
      creator: "GCREATOR",
      resolver: "GRESOLVER",
      question: "Will the test pass?",
      description: "A direct RPC market",
      token: "CTOKEN",
      createdAt: 100n,
      closeAt: 200n,
      resolutionTimeout: 300n,
      yesPool: 40n,
      noPool: 60n,
      status: MarketStatus.Resolved,
      outcome: Outcome.Yes,
      finalizedAt: 250n,
    };

    expect(mapContractMarket(market)).toMatchObject({
      id: 7,
      question: "Will the test pass?",
      closeAt: 200,
      yesPool: "40",
      noPool: "60",
      status: "resolved",
      outcome: "yes",
      finalizedAt: 250,
      createdTx: null,
    });
  });

  it("rejects identifiers that cannot be represented safely", () => {
    const market = {
      id: BigInt(Number.MAX_SAFE_INTEGER) + 1n,
      creator: "GCREATOR",
      resolver: "GRESOLVER",
      question: "Unsafe id",
      description: "",
      token: "CTOKEN",
      createdAt: 100n,
      closeAt: 200n,
      resolutionTimeout: 300n,
      yesPool: 0n,
      noPool: 0n,
      status: MarketStatus.Open,
      outcome: null,
      finalizedAt: null,
    } satisfies Market;

    expect(() => mapContractMarket(market)).toThrow("market id");
  });
});
