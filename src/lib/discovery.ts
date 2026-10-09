import { MarketStatus, Outcome, type Market } from "@resolve-protocol/sdk";

import type { IndexerMarket } from "./market-status";
import { getReadClient } from "./sdk";

const MAX_DISCOVERY_LIMIT = 50;
const RPC_BATCH_SIZE = 4;

function safeNumber(value: bigint, field: string): number {
  const result = Number(value);
  if (!Number.isSafeInteger(result)) {
    throw new Error(`${field} exceeds JavaScript's safe integer range.`);
  }
  return result;
}

function marketStatus(status: MarketStatus): IndexerMarket["status"] {
  switch (status) {
    case MarketStatus.Open:
      return "open";
    case MarketStatus.Resolved:
      return "resolved";
    case MarketStatus.Invalid:
      return "invalid";
  }
}

function marketOutcome(outcome: Outcome | null): IndexerMarket["outcome"] {
  switch (outcome) {
    case Outcome.Yes:
      return "yes";
    case Outcome.No:
      return "no";
    case Outcome.Invalid:
      return "invalid";
    case null:
      return null;
  }
}

export function mapContractMarket(market: Market): IndexerMarket {
  return {
    id: safeNumber(market.id, "market id"),
    creator: market.creator,
    resolver: market.resolver,
    question: market.question,
    description: market.description,
    token: market.token,
    createdAt: safeNumber(market.createdAt, "created timestamp"),
    closeAt: safeNumber(market.closeAt, "close timestamp"),
    resolutionTimeout: safeNumber(
      market.resolutionTimeout,
      "resolution timeout",
    ),
    yesPool: market.yesPool.toString(),
    noPool: market.noPool.toString(),
    status: marketStatus(market.status),
    outcome: marketOutcome(market.outcome),
    finalizedAt:
      market.finalizedAt === null
        ? null
        : safeNumber(market.finalizedAt, "finalized timestamp"),
    createdTx: null,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchMarketsFromContract(
  limit = MAX_DISCOVERY_LIMIT,
): Promise<IndexerMarket[]> {
  const boundedLimit = Math.max(1, Math.min(limit, MAX_DISCOVERY_LIMIT));
  const client = getReadClient();
  const nextMarketId = await client.getNextMarketId();
  const firstMarketId = 1n;
  const latestMarketId = nextMarketId - 1n;

  if (latestMarketId < firstMarketId) return [];

  const startMarketId =
    latestMarketId - BigInt(boundedLimit) + 1n > firstMarketId
      ? latestMarketId - BigInt(boundedLimit) + 1n
      : firstMarketId;
  const ids: bigint[] = [];
  for (let id = latestMarketId; id >= startMarketId; id -= 1n) ids.push(id);

  const markets: IndexerMarket[] = [];
  for (let offset = 0; offset < ids.length; offset += RPC_BATCH_SIZE) {
    const batch = ids.slice(offset, offset + RPC_BATCH_SIZE);
    const results = await Promise.all(batch.map((id) => client.getMarket(id)));
    markets.push(...results.map(mapContractMarket));
  }
  return markets;
}
