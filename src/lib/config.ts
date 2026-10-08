/**
 * Public runtime configuration. Only NEXT_PUBLIC_* vars are used.
 */
import { StrKey } from "@stellar/stellar-sdk";

export type StellarNetworkName = "testnet" | "futurenet" | "mainnet" | "custom";

export type AppConfig = {
  network: StellarNetworkName;
  rpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
  contractId: string;
  indexerApiUrl: string;
  settlementTokenId: string;
  tokenDecimals: number;
};

const DEFAULT_PASSPHRASE = "Test SDF Network ; September 2015";
const DEFAULT_RPC_URL = "https://soroban-testnet.stellar.org";
const DEFAULT_HORIZON_URL = "https://horizon-testnet.stellar.org";
const DEFAULT_CONTRACT_ID = "CD3YJNAYKVKT72DYPVS644OPNVNW6673TUIQWGXXA4VQD7536ARWB6MZ";
const DEFAULT_SETTLEMENT_TOKEN_ID = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

function trim(value: string | undefined): string {
  return (value ?? "").trim();
}

export function getAppConfig(): AppConfig {
  return {
    network: (trim(process.env.NEXT_PUBLIC_STELLAR_NETWORK) ||
      "testnet") as StellarNetworkName,
    rpcUrl: trim(process.env.NEXT_PUBLIC_SOROBAN_RPC_URL) || DEFAULT_RPC_URL,
    horizonUrl: trim(process.env.NEXT_PUBLIC_HORIZON_URL) || DEFAULT_HORIZON_URL,
    networkPassphrase:
      trim(process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE) || DEFAULT_PASSPHRASE,
    contractId: trim(process.env.NEXT_PUBLIC_RESOLVE_CONTRACT_ID) || DEFAULT_CONTRACT_ID,
    indexerApiUrl: trim(process.env.NEXT_PUBLIC_INDEXER_API_URL),
    settlementTokenId: trim(process.env.NEXT_PUBLIC_SETTLEMENT_TOKEN_ID) || DEFAULT_SETTLEMENT_TOKEN_ID,
    tokenDecimals: 7,
  };
}

export function assertWriteConfig(config: AppConfig): void {
  const missing: string[] = [];
  if (!config.rpcUrl) missing.push("NEXT_PUBLIC_SOROBAN_RPC_URL");
  if (!config.contractId) missing.push("NEXT_PUBLIC_RESOLVE_CONTRACT_ID");
  if (!config.networkPassphrase) missing.push("NEXT_PUBLIC_NETWORK_PASSPHRASE");
  if (!config.settlementTokenId) missing.push("NEXT_PUBLIC_SETTLEMENT_TOKEN_ID");
  if (missing.length > 0) {
    throw new Error(
      `Missing required configuration: ${missing.join(", ")}. Copy .env.example to .env.local and fill in deployment values.`,
    );
  }
  if (!StrKey.isValidContract(config.contractId)) {
    throw new Error("NEXT_PUBLIC_RESOLVE_CONTRACT_ID is not a valid Stellar contract address.");
  }
  if (!StrKey.isValidContract(config.settlementTokenId)) {
    throw new Error("NEXT_PUBLIC_SETTLEMENT_TOKEN_ID is not a valid Stellar contract address.");
  }
}

export function hasIndexer(config: AppConfig = getAppConfig()): boolean {
  return Boolean(config.indexerApiUrl);
}

export function hasContract(config: AppConfig = getAppConfig()): boolean {
  return Boolean(config.contractId && config.rpcUrl);
}
