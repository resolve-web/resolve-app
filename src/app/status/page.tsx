import { StrKey } from "@stellar/stellar-sdk";

import { getAppConfig } from "@/lib/config";

type Check = { label: string; ok: boolean; detail: string };

async function indexerCheck(url: string): Promise<Check> {
  if (!url) return { label: "Indexer", ok: false, detail: "Not configured" };
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/ready`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return { label: "Indexer", ok: response.ok, detail: response.ok ? "Ingestion ready" : `Readiness returned ${response.status}` };
  } catch {
    return { label: "Indexer", ok: false, detail: "Readiness endpoint unreachable" };
  }
}

export default async function StatusPage() {
  const config = getAppConfig();
  const checks: Check[] = [
    { label: "Resolve contract", ok: StrKey.isValidContract(config.contractId), detail: config.contractId || "Not configured" },
    { label: "Settlement token", ok: StrKey.isValidContract(config.settlementTokenId), detail: config.settlementTokenId || "Not configured" },
    { label: "Soroban RPC", ok: Boolean(config.rpcUrl), detail: config.rpcUrl || "Not configured" },
    await indexerCheck(config.indexerApiUrl),
  ];
  const ready = checks.every((check) => check.ok);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-xs uppercase tracking-[0.18em] text-ink-faint">Deployment health</p>
      <h1 className="mt-2 font-serif text-4xl text-ink">Resolve status</h1>
      <p className="mt-3 text-ink-soft">Network: {config.network}. Overall: <strong>{ready ? "ready" : "configuration required"}</strong>.</p>
      <div className="mt-8 divide-y divide-ink-line border-y border-ink-line">
        {checks.map((check) => (
          <div key={check.label} className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr]">
            <div className="font-medium text-ink">{check.ok ? "✓" : "×"} {check.label}</div>
            <div className="break-all text-sm text-ink-soft">{check.detail}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
