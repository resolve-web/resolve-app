# Web deployment checklist

## Verified public services

| Component | Value |
| --- | --- |
| Network | Stellar Testnet |
| Resolve contract | `CD3YJNAYKVKT72DYPVS644OPNVNW6673TUIQWGXXA4VQD7536ARWB6MZ` |
| Settlement token | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| Application | <https://resolveit-app.vercel.app> |
| App status | <https://resolveit-app.vercel.app/status> |
| Indexer readiness | <https://resolve-indexer.onrender.com/ready> |
| Contract release | [GitHub releases](https://github.com/resolve-web/resolve-contract/releases) |

## Environment

Copy the contract manifest values into the matching `NEXT_PUBLIC_*` variables. In production, set `NEXT_PUBLIC_INDEXER_API_URL=/api/indexer`; the app proxies that same-origin path to the public indexer. `INDEXER_API_URL` is an optional server-only override for the status-page health check.

All `NEXT_PUBLIC_*` values are visible to users. Never place wallet seeds, source-account secrets, API credentials, or signing material in them.

## Release gate

Run these commands from `resolve-app`:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

After deployment:

1. Confirm `/`, `/status`, `/create`, and `/portfolio` return successfully.
2. Confirm `/status` reports the contract, token, RPC, and indexer as ready.
3. Complete the Freighter testnet flow in [DEMO.md](DEMO.md).
4. Record the deployed commit, contract release, and transaction evidence.
5. Confirm the GitBook site has synced the same commit and is publicly accessible.
