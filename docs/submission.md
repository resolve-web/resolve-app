# Submission evidence

## Verified

- Four public repositories with Apache-2.0 licensing and contribution/security guidance.
- Required CI checks on protected `main` branches.
- Vercel application responds publicly over HTTPS.
- Render indexer exposes healthy and ready endpoints with persistent storage.
- Deployed Stellar Testnet contract and settlement token are recorded in version control.
- Public create → stake → resolve → claim transaction hashes are recorded.
- Contract unit tests cover creation, staking, resolution, invalidation, refunds, rounding, double claims, and pool invariants.
- App, SDK, and indexer have automated TypeScript checks and tests.
- Repository `main` branches require their CI checks and reject force pushes and deletion.
- The public status page verifies the contract, settlement token, RPC, and indexer readiness.

## Public evidence

- Application: <https://resolveit-app.vercel.app>
- Deployment status: <https://resolveit-app.vercel.app/status>
- Documentation: <https://entity-6.gitbook.io/resolve-documentation/>
- Indexer health: <https://resolve-indexer.onrender.com/health>
- Indexer readiness: <https://resolve-indexer.onrender.com/ready>
- Contract explorer: <https://stellar.expert/explorer/testnet/contract/CD3YJNAYKVKT72DYPVS644OPNVNW6673TUIQWGXXA4VQD7536ARWB6MZ>
- Contract releases: <https://github.com/resolve-web/resolve-contract/releases>

The transaction hashes for the verified testnet lifecycle are versioned in [`resolve-contract/deployments/testnet-e2e.json`](https://github.com/resolve-web/resolve-contract/blob/main/deployments/testnet-e2e.json).

## Scope and limitations

- Testnet only.
- Contracts are unaudited.
- Resolver correctness is a trust assumption.
- The SDK is installed from GitHub until an npm release is published.
- The indexer is not a settlement authority.
- Stellar Wave repository approval remains at the organizers' discretion.
