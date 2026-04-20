# Contributing

This repository contains the standalone Raycast extension for put.io.

## Setup

Install dependencies from the repository root:

```bash
npm install
```

## Working in the repo

- command and metadata configuration lives in [`package.json`](./package.json)
- source files live in `src/`
- publishing is handled through Raycast's tooling, not a custom release script in this repo

## Validation

Before opening a pull request:

- run `npm run lint`
- run `npm run build` when the change affects commands, metadata, packaging, or publish behavior
- use `npm run dev` to smoke test the affected command in Raycast when the change affects runtime behavior

If the change touches API behavior, auth, or result rendering, include the exact user flow you checked.

## Pull Requests

Helpful pull requests usually include:

- screenshots or recordings for changed Raycast command UI
- sanity checks for auth and put.io API interactions when relevant
- rollout notes when a change requires a new publish or updated store metadata
