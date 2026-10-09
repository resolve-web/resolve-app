# Security

- Resolve is an unaudited testnet preview.
- Never enter a secret key in the application. Freighter performs wallet signing.
- The designated resolver is trusted to report the correct outcome.
- The indexer is a cache and cannot authorize claims or settlement.
- The settlement token is assumed to implement SEP-41 correctly.
- v0.1.0 has no upgrade or administrator path; changes require a new deployment.

Report vulnerabilities privately through the relevant repository's GitHub Security Advisory page. Do not publish exploitable details in a public issue.
