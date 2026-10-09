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

## Scope and limitations

- Testnet only.
- Contracts are unaudited.
- Resolver correctness is a trust assumption.
- The SDK is installed from GitHub until an npm release is published.
- The indexer is not a settlement authority.
