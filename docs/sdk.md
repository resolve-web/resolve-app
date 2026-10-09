# TypeScript SDK

The SDK provides typed builders for contract reads and writes. It supports ESM and CommonJS on Node.js 22.12 or newer.

```bash
npm install github:resolve-web/resolve-sdk
```

The public npm package has not been published yet, so production consumers should pin a Git commit.

Write methods return an `AssembledTransaction`; the caller signs and sends it. Read methods simulate against Soroban RPC. See the [SDK repository](https://github.com/resolve-web/resolve-sdk) for examples and API details.
