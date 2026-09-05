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
- `pnpm test` for account-bootstrap lifecycle tests with real React and Raycast server-state hooks
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

## Account bootstrap checks

In Raycast, verify that a pending account lookup shows loading, then stops loading on
a rejected credential or network failure. The error view must offer Retry and Open
Extension Preferences. After changing the app-specific password, retry and confirm
that the command opens with the new account. Also check keyboard navigation and
VoiceOver announcements on the error actions.

The deterministic tests mock the Raycast host and account API boundary while running
the installed `usePromise` hook and React renderer. They cover recovery and credential
changes but do not replace native Raycast acceptance.
