# Agent Guide

Keep the README clean, and verify changes in Raycast when behavior moves.

## Start Here

- [Overview](./README.md)
- [Contributing](./CONTRIBUTING.md) — setup, hook install, validation, and PR evidence
- [Security](./SECURITY.md)

## Repo Shape

- Extension metadata, commands, and scripts live in the [extension manifest](./package.json)
- Source files live in `src/`
- CI runs `pnpm run verify` from the [build workflow](./.github/workflows/build.yml)

## Working Rules

- Keep [Overview](./README.md) consumer-facing
- Keep contributor workflow and validation in [Contributing](./CONTRIBUTING.md)
- Prefer `pnpm` commands from the repo root because this repo is lockfile-driven with `pnpm-lock.yaml`

## Verification

`pnpm run verify` is the gate (lint, typecheck, build, and peer check; see the
`scripts` block in [package.json](./package.json)). Keep `pnpm run build` in
verification so command compilation also runs through Raycast. When behavior
changes, also smoke test the affected command with `pnpm run dev`.
