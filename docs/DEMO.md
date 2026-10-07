# Resolve demo runbook

Use two funded Stellar testnet wallets and a deployed settlement token. Open `/status` first and continue only when all checks are green.

## Three-minute judging flow

1. Connect wallet A and open **Create**.
2. Create a market with an objective question, a close time at least 60 seconds ahead, and a one-hour resolution timeout.
3. Open the new market and stake YES with wallet A. Switch to wallet B and stake NO.
4. Show that discovery and portfolio data come from the indexer, while the market detail refreshes authoritative values from Soroban RPC.
5. After close, use the designated resolver wallet to resolve YES or NO.
6. Claim with the winning wallet and show the confirmed transaction plus updated position.

## Recovery path

If the resolver does not act, advance to `close_at + resolution_timeout` and call invalidate from either wallet. Both positions then receive their original deposits through the same claim flow.

## Evidence to capture

- Public app URL and `/status` screenshot
- Contract ID and Stellar Expert link
- Create, stake, resolve, and claim transaction hashes
- Indexer `/ready` response
- Commit SHA used for the demo

Never use production keys or mainnet assets in the demo.
