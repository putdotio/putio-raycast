# Contributing

This repository contains the standalone Raycast extension for put.io.

## Setup

Install dependencies from the repository root:

```bash
pnpm install
pnpm run hooks:install
```

The checked-in pre-push hook runs the full verification gate (`pnpm run verify`) before each push.

## Working in the repo

- command and metadata configuration lives in the [extension manifest](./package.json)
- source files live in `src/`
- publishing is handled through Raycast's tooling, not a custom release script in this repo

## Validation

Before opening a pull request:

- CI installs dependencies with `pnpm install --frozen-lockfile` using the Node.js version in [`.node-version`](./.node-version)
- run `pnpm run lint`; it uses Raycast's relaxed lint mode because strict Raycast lockfile validation only accepts npm lockfiles
- run `pnpm run typecheck` when the change touches TypeScript sources
- run `pnpm run build` when the change affects commands, metadata, packaging, or publish behavior
- use `pnpm run dev` to smoke test the affected command in Raycast when the change affects runtime behavior

If the change touches API behavior, auth, or result rendering, include the exact user flow you checked.

## Pull Requests

Helpful pull requests usually include:

- screenshots or recordings for changed Raycast command UI
- sanity checks for auth and put.io API interactions when relevant
- rollout notes when a change requires a new publish or updated store metadata
