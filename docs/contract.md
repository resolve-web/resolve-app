# Smart contract

The Resolve Soroban contract supports:

- `create_market`
- `stake`
- `resolve`
- `invalidate`
- `claim`
- `get_market`, `get_position`, `get_claimable`, and `next_market_id`

The resolver is trusted to report an honest outcome. Permissionless invalidation protects funds only when no resolution arrives before the configured timeout; it does not arbitrate a disputed outcome.

Payouts use integer arithmetic:

```text
floor(user winning stake × total pool / winning pool)
```

Rounding dust remains in the contract. The v0.1.0 contract is not upgradeable and has not received an independent audit.

See the [contract repository](https://github.com/resolve-web/resolve-contract) for source, tests, and the full security model.
