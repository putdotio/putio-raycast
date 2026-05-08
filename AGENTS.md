# Agent Guide

Keep the README clean, and verify changes in Raycast when behavior moves.

## Start Here

- [Overview](./README.md)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)

## Repo Shape

- Extension metadata, commands, and scripts live in the [extension manifest](./package.json)
- Source files live in `src/`
- CI currently runs from the [build workflow](./.github/workflows/build.yml)

## Working Rules

- Keep [Overview](./README.md) consumer-facing
- Keep contributor workflow and validation in [Contributing](./CONTRIBUTING.md)
- Prefer `npm` commands from the repo root because this repo is lockfile-driven with `package-lock.json`

## Verification

Use the existing scripts:

```bash
npm run lint
npm run build
```

When behavior changes, also smoke test the affected command with `npm run dev`.
