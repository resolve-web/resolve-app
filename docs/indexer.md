# Indexer and API

The Render service ingests Resolve contract events into a persistent SQLite database and exposes a read-only API.

| Endpoint | Purpose |
| --- | --- |
| `/health` | Process health and latest cursor |
| `/ready` | Confirms ingestion is configured and checkpointed |
| `/markets` | Paginated market discovery |
| `/markets/:id` | Indexed market |
| `/markets/:id/positions` | Indexed positions |
| `/users/:address/positions` | User discovery |
| `/users/:address/activity` | User event history |

The deployment replays from ledger `5095009`, the beginning of the verified testnet lifecycle, when it detects an empty database with a newer checkpoint. Event identities make reprocessing idempotent.

The indexer is not authoritative for balances, payouts, or settlement. Those values must be confirmed through the contract.
