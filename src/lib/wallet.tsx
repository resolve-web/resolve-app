"use client";

import {
  getAddress,
  requestAccess,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getAppConfig } from "./config";
import { mapWalletError, type TxUiError } from "./errors";

export type WalletStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "wrong_network";

type WalletContextValue = {
  status: WalletStatus;
  address: string | null;
  error: TxUiError | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;
  signTransaction: (
    xdr: string,
  ) => Promise<{ signedTxXdr: string; signerAddress?: string }>;
  networkPassphrase: string;
};

const WalletContext = createContext<WalletContextValue | null>(null);

const STORAGE_KEY = "resolve.wallet.connected";

export function WalletProvider({ children }: { children: ReactNode }) {
  const config = getAppConfig();
  const [status, setStatus] = useState<WalletStatus>("disconnected");
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<TxUiError | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    let cancelled = false;
    (async () => {
      try {
        setStatus("connecting");
        const result = await getAddress();
        if (result.error || !result.address) {
          throw new Error(
            String(result.error ?? "Freighter is not connected"),
          );
        }
        const addr = result.address;
        if (cancelled) return;
        setAddress(addr);
        setStatus("connected");
      } catch {
        if (cancelled) return;
        window.localStorage.removeItem(STORAGE_KEY);
        setStatus("disconnected");
        setAddress(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    setStatus("connecting");
    try {
      const result = await requestAccess();
      if (result.error || !result.address) {
        throw new Error(
          String(result.error ?? "Freighter access was not granted"),
        );
      }
      window.localStorage.setItem(STORAGE_KEY, "true");
      setAddress(result.address);
      setStatus("connected");
    } catch (err) {
      setError(mapWalletError(err));
      setStatus("disconnected");
      setAddress(null);
    }
  }, []);

  const disconnect = useCallback(async () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    setStatus("disconnected");
    setError(null);
  }, []);

  const signTransaction = useCallback(
    async (xdr: string) => {
      if (!address) {
        throw new Error("Wallet is not connected.");
      }
      try {
        const result = await freighterSignTransaction(xdr, {
          address,
          networkPassphrase: config.networkPassphrase,
        });
        if (result.error || !result.signedTxXdr) {
          throw new Error(String(result.error ?? "Freighter did not return a signed transaction"));
        }
        return {
          signedTxXdr: result.signedTxXdr,
          signerAddress: address,
        };
      } catch (err) {
        const mapped = mapWalletError(err);
        setError(mapped);
        throw Object.assign(new Error(mapped.message), { ui: mapped });
      }
    },
    [address, config.networkPassphrase],
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      status,
      address,
      error,
      connect,
      disconnect,
      clearError: () => setError(null),
      signTransaction,
      networkPassphrase: config.networkPassphrase,
    }),
    [
      status,
      address,
      error,
      connect,
      disconnect,
      signTransaction,
      config.networkPassphrase,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
