# Architecture

```text
Freighter wallet
      |
      v
Resolve web app ---> Resolve TypeScript SDK ---> Stellar Soroban RPC
      |                                             |
      v                                             v
Resolve indexer <--- contract events <--- Resolve contract + SEP-41 token
```

The contract and Stellar ledger are authoritative for financial state. The indexer is a discovery cache: it lists markets, positions, and activity, but it never authorizes settlement or determines claim amounts.

The browser signs transactions through Freighter. The SDK builds and simulates contract calls. The application never stores secret keys.

## Market lifecycle

1. A creator opens a market with a question, resolver, token, close time, and resolution timeout.
2. Participants stake on YES or NO before closing.
3. The designated resolver records YES, NO, or Invalid after closing.
4. If the resolver does not act before the timeout, anyone can invalidate the market.
5. Winners claim proportional payouts. Invalid markets refund both sides.
