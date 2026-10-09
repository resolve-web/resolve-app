"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchMarketsFromContract } from "@/lib/discovery";
import { fetchMarkets } from "@/lib/indexer";
import type { IndexerMarket } from "@/lib/market-status";
import { mapRpcReadError } from "@/lib/errors";
import { hasIndexer, getAppConfig } from "@/lib/config";
import { MarketCard } from "./MarketCard";
import { EmptyState, ErrorState, LoadingState } from "./States";

type Filter = "all" | "open" | "resolved" | "invalid";

export function MarketDiscovery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [markets, setMarkets] = useState<IndexerMarket[] | null>(null);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"indexer" | "contract" | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (hasIndexer()) {
        try {
          const res = await fetchMarkets({
            status: filter === "all" ? undefined : filter,
            limit: 50,
          });
          setMarkets(res.markets);
          setSource("indexer");
          return;
        } catch {
          // The contract is authoritative and remains available if discovery is down.
        }
      }

      const contractMarkets = await fetchMarketsFromContract(50);
      setMarkets(
        filter === "all"
          ? contractMarkets
          : contractMarkets.filter((market) => market.status === filter),
      );
      setSource("contract");
    } catch (err) {
      const mapped = mapRpcReadError(err);
      setMarkets(null);
      setSource(null);
      setError({ title: mapped.title, message: mapped.message });
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  const indexerUrl = getAppConfig().indexerApiUrl;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink-line pb-6">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-ink sm:text-5xl">
            Markets
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Binary YES/NO markets read from the indexer when available, with an
            authoritative contract fallback. Settlement always goes through the contract.
          </p>
        </div>
        <div className="flex gap-1 text-sm" role="tablist" aria-label="Filter">
          {(["all", "open", "resolved", "invalid"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 capitalize ${
                filter === f
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {source ? (
        <p className="mt-3 text-xs text-ink-faint">
          Source: {source === "indexer" ? (
            <>indexer <span className="font-mono">{indexerUrl}</span></>
          ) : (
            "Soroban RPC"
          )}
        </p>
      ) : null}

      {loading ? <LoadingState label="Loading markets…" /> : null}

      {!loading && error ? (
        <div className="mt-8">
          <ErrorState
            title={error.title}
            message={error.message}
            onRetry={() => void load()}
          />
        </div>
      ) : null}

      {!loading && !error && markets && markets.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No markets yet"
            description="Create the first market to start trading."
          />
        </div>
      ) : null}

      {!loading && !error && markets && markets.length > 0 ? (
        <div className="mt-4">
          {markets.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
