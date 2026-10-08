import { StrKey } from "@stellar/stellar-sdk";
import { afterEach, describe, expect, it, vi } from "vitest";

import { assertWriteConfig, getAppConfig, type AppConfig } from "../src/lib/config";

const contract = StrKey.encodeContract(Buffer.alloc(32, 8));
const valid: AppConfig = { network: "testnet", rpcUrl: "https://soroban-testnet.stellar.org", horizonUrl: "", networkPassphrase: "Test SDF Network ; September 2015", contractId: contract, indexerApiUrl: "", settlementTokenId: contract, tokenDecimals: 7 };

describe("write configuration", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("defaults to the verified public testnet deployment", () => {
    vi.stubEnv("NEXT_PUBLIC_RESOLVE_CONTRACT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_SETTLEMENT_TOKEN_ID", "");
    const config = getAppConfig();
    expect(config.contractId).toBe("CD3YJNAYKVKT72DYPVS644OPNVNW6673TUIQWGXXA4VQD7536ARWB6MZ");
    expect(() => assertWriteConfig(config)).not.toThrow();
  });
  it("accepts complete Stellar configuration", () => expect(() => assertWriteConfig(valid)).not.toThrow());
  it("rejects malformed contract IDs", () => expect(() => assertWriteConfig({ ...valid, contractId: "CINVALID" })).toThrow(/RESOLVE_CONTRACT_ID/));
  it("requires the settlement token", () => expect(() => assertWriteConfig({ ...valid, settlementTokenId: "" })).toThrow(/SETTLEMENT_TOKEN_ID/));
});
