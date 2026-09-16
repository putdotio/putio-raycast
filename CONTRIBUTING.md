# Contributing

This repository contains the standalone Raycast extension for put.io.

## Setup

Install dependencies from the repository root:

```bash
pnpm install
pnpm run hooks:install
```

`hooks:install` points Git at the tracked `.git-hooks/`, whose pre-push hook runs `pnpm run verify` before each push.

## Working in the repo

- command and metadata configuration lives in the [extension manifest](./package.json)
- source files live in `src/`
- publishing is handled through Raycast's tooling, not a custom release script in this repo

## Validation

Run `pnpm run verify` before opening a pull request; CI runs the same gate after `pnpm install --frozen-lockfile` on the Node.js version in [`.node-version`](./.node-version). It chains:

- `pnpm run lint`, which uses Raycast's relaxed lint mode because strict Raycast lockfile validation only accepts npm lockfiles
- `pnpm run typecheck` (`tsc --noEmit`) as an explicit gate for TypeScript sources
- `pnpm run build`, so command compilation also runs through Raycast
- `pnpm peers check`

Use `pnpm run dev` to smoke test the affected command in Raycast when the change affects runtime behavior.

If the change touches API behavior, auth, or result rendering, include the exact user flow you checked.

## Pull Requests

Helpful pull requests usually include:

- screenshots or recordings for changed Raycast command UI, uploaded with `gh pr create --attach ./file.png` or `gh pr comment <n> --attach ./file.mp4` rather than committed
- sanity checks for auth and put.io API interactions when relevant
- rollout notes when a change requires a new publish or updated store metadata
