# Agent Guide

Raycast extension for put.io files, transfers, and history, installed from the
[Raycast Store](https://www.raycast.com/putio/putio). Commands, preferences,
and scripts live in the [extension manifest](./package.json); source lives in
`src/`.

## Start Here

- [Overview](./README.md)
- [Contributing](./CONTRIBUTING.md): setup, hooks, validation, and PR evidence
- [Security](https://github.com/putdotio/.github/blob/main/SECURITY.md)

## Rules

- Keep `README.md` consumer-facing and contributor workflow in `CONTRIBUTING.md`.
- Use `pnpm` from the repo root; `pnpm-lock.yaml` is the lockfile.

## Verification

`pnpm run verify` is the gate; its chain is `scripts.verify` in
[package.json](./package.json), and CI runs it from the
[build workflow](./.github/workflows/build.yml). Keep `pnpm run build` in the
chain so command compilation runs through Raycast. When behavior changes, also
smoke test the affected command with `pnpm run dev`. Docs-only changes need no
runtime proof; no gate checks Markdown, so confirm the links and commands you
name resolve.

`pnpm run dev` loads the extension into your local Raycast with the
app-specific password from its preferences, so Delete, Rename, and Add
Transfers act on that real put.io account.

## Delivery

Pull requests squash-merge to `main`, and a merge runs CI only. The manual
store submission is `pnpm run publish`, which opens a pull request in Raycast's
extensions repository; users get the change only after Raycast reviews and
merges it.
