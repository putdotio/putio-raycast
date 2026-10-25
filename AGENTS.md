# Agent Guide

Raycast extension for put.io files, transfers, and history, installed from the
[Raycast Store](https://www.raycast.com/putio/putio). Commands, preferences,
and scripts live in the [extension manifest](./package.json); source lives in
`src/`. Contributor setup is in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Rules

- Keep `README.md` consumer-facing and contributor workflow in `CONTRIBUTING.md`.
- Keep `pnpm run build` in `scripts.verify` so Raycast compiles the commands.

## Verification

- `pnpm run verify` is the gate; the
  [build workflow](./.github/workflows/build.yml) runs it in CI.
- When behavior changes, smoke test the affected command with `pnpm run dev`.
  It uses the app-specific password from your local Raycast preferences, so
  Delete, Rename, and Add Transfers act on that real put.io account.
- Docs-only changes need no runtime proof. `pnpm run markdown:check` checks
  formatting; CI checks relative links and anchors. Confirm external links and
  commands yourself.

## Delivery

A merge to `main` runs CI only. Store submission is a manual
`pnpm run publish`: it opens a pull request in Raycast's extensions repository,
and users get the change only after Raycast merges it.
