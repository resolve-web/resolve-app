import { StrKey } from "@stellar/stellar-sdk";
import { describe, expect, it } from "vitest";

import { assertWriteConfig, type AppConfig } from "../src/lib/config";

const contract = StrKey.encodeContract(Buffer.alloc(32, 8));
const valid: AppConfig = { network: "testnet", rpcUrl: "https://soroban-testnet.stellar.org", horizonUrl: "", networkPassphrase: "Test SDF Network ; September 2015", contractId: contract, indexerApiUrl: "", settlementTokenId: contract, tokenDecimals: 7 };

describe("write configuration", () => {
  it("accepts complete Stellar configuration", () => expect(() => assertWriteConfig(valid)).not.toThrow());
  it("rejects malformed contract IDs", () => expect(() => assertWriteConfig({ ...valid, contractId: "CINVALID" })).toThrow(/RESOLVE_CONTRACT_ID/));
  it("requires the settlement token", () => expect(() => assertWriteConfig({ ...valid, settlementTokenId: "" })).toThrow(/SETTLEMENT_TOKEN_ID/));
});
