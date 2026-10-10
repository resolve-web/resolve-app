# Maintainer and Wave checklist

Resolve is maintained across four public repositories under the [`resolve-web`](https://github.com/resolve-web) organization. Each repository has a focused responsibility and its own contributor backlog.

## Before applying

- Confirm every `main` branch is protected and its current required CI checks pass.
- Keep each repository below ten open, actionable issues.
- Close completed or duplicate issues before presenting the backlog to contributors.
- Give every issue a concrete outcome, acceptance criteria, and an appropriate scope for a one-week contribution cycle.
- Verify the public application, status page, indexer health, and indexer readiness endpoints.
- Run the deployed Freighter flow in [DEMO.md](DEMO.md).
- Publish a contract release from the exact pinned source revision used for the WASM artifact.
- Confirm GitBook has synced the latest documentation commit and the docs site is public.

## Applying to Stellar Wave

1. Sign in to the Drips Wave application with the GitHub account that can manage `resolve-web`.
2. Open **Maintainers → Orgs and Repos**.
3. Install or update the Drips Wave GitHub App for the organization.
4. Sync the public repositories and apply the relevant repositories to the Stellar Wave Program.
5. Wait for organizer approval before adding issues to a Wave.

Repository approval is decided by the program organizers. Technical readiness and a clear backlog improve the application but do not guarantee acceptance.

## During a Wave

- Review applications promptly and assign one contributor per issue.
- Answer scope questions in public issue comments.
- Review pull requests against the stated acceptance criteria and required CI checks.
- Keep secrets out of issues, logs, screenshots, and test fixtures.
- Close or update issues as soon as their implementation state changes.
