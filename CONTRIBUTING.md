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
- run `pnpm test` for account-bootstrap lifecycle tests with real React and Raycast server-state hooks
- run `pnpm run typecheck` when the change touches TypeScript sources
- run `pnpm run build` when the change affects commands, metadata, packaging, or publish behavior
- use `pnpm run dev` to smoke test the affected command in Raycast when the change affects runtime behavior

If the change touches API behavior, auth, or result rendering, include the exact user flow you checked.

## Pull Requests

Helpful pull requests usually include:

- screenshots or recordings for changed Raycast command UI
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
