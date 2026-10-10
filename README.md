# Resolve App

![Resolve logo](public/resolve-logo.png)

Reference web application for **Resolve** — binary YES/NO prediction markets on Stellar (Soroban).

## Architecture

```text
Wallet → resolve-app → @resolve-protocol/sdk → Soroban RPC → Resolve Contract → Token (SEP-41)
                              ↑
                    resolve-indexer (events only; not settlement authority)
```

| Path | Role |
|------|------|
| Wallet | User auth + transaction signing through the official Freighter API |
| App | UI, validation, tx review, discovery |
| SDK | Contract reads/writes |
| RPC | Authoritative chain state |
| Indexer | Market lists / portfolio discovery from events |

**The indexer is never authority for settlement.** Claims, stakes, and create-market always go through the SDK to the contract. If RPC or the indexer fails, the UI shows an error — it does not invent pools or balances.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- `@resolve-protocol/sdk` via `file:./vendor/resolve-sdk` (vendored build for deploy)
- Official Freighter browser-wallet integration

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Market discovery (indexer) |
| `/markets/[id]` | Market detail, stake, claim/refund |
| `/create` | Create market |
| `/portfolio` | Positions by category |
| `/status` | Public deployment and indexer readiness |

## Setup

### Prerequisites

- Node.js 22.12+
- SDK is vendored at `vendor/resolve-sdk` (refresh after SDK changes: build sibling `../resolve-sdk`, then copy `dist` + `package.json`)
- Optional indexer running (default `http://localhost:3080`)

### Install & run

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_SOROBAN_RPC_URL, NEXT_PUBLIC_RESOLVE_CONTRACT_ID,
# NEXT_PUBLIC_SETTLEMENT_TOKEN_ID, NEXT_PUBLIC_INDEXER_API_URL, etc.

npm ci

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |

## Configuration

All browser config uses `NEXT_PUBLIC_*` variables (see `.env.example`):

```
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_SOROBAN_RPC_URL=
NEXT_PUBLIC_HORIZON_URL=
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_RESOLVE_CONTRACT_ID=
NEXT_PUBLIC_INDEXER_API_URL=http://localhost:3080
NEXT_PUBLIC_SETTLEMENT_TOKEN_ID=
```

## Wallet / transaction UX

The app handles disconnected, connecting, wrong network, rejected signatures, failed transactions, pending confirmation, confirmed, insufficient balance, and mapped contract errors (`parseResolveError`). Stake, create, and claim flows show a **review summary** before the wallet prompt.

For a repeatable submission recording, follow the [demo runbook](docs/DEMO.md).
Use the [deployment checklist](docs/deployment.md) as the release gate for the public build.
Read the published [Resolve documentation](https://entity-6.gitbook.io/resolve-documentation/) for the hosted guide, maintainer checklist, and submission evidence.

## License

Apache-2.0 — see [LICENSE](./LICENSE).
