# Web deployment checklist

## Required services

- A verified Resolve contract deployment manifest from `resolve-contract/deployments/testnet.json`
- A public `resolve-indexer` whose `/ready` endpoint returns HTTP 200
- A Next.js host such as Vercel

## Environment

Copy the contract manifest values into the matching `NEXT_PUBLIC_*` variables. Set the indexer `CORS_ORIGINS` to the final app origin before deploying the browser application.

All `NEXT_PUBLIC_*` values are visible to users. Never place wallet secrets, source account seeds, API secrets, or signing material in them.

## Release gate

Run these commands from this repository:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

After deployment, verify `/status`, connect a testnet wallet, and execute the full flow in `docs/DEMO.md`. Record the app URL, contract ID, indexer URL, release commit, and transaction hashes in the submission.
