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

- `pnpm run verify` is the gate; its chain is `scripts.verify` in
  [package.json](./package.json), and CI runs it from the
  [build workflow](./.github/workflows/build.yml). Keep `pnpm run build` in the
  chain so Raycast compiles the commands.
- When behavior changes, smoke test the affected command with `pnpm run dev`.
  It loads the extension into your local Raycast with the app-specific password
  from its preferences, so Delete, Rename, and Add Transfers act on that real
  put.io account.
- Docs-only changes need no runtime proof. `pnpm run markdown:check` (oxfmt,
  in the gate) checks formatting, and the shared
  [links action](https://github.com/putdotio/.github#actionslinks) checks
  relative links and anchors; confirm external links and commands yourself.
- The workflow's last step, the shared
  [scan action](https://github.com/putdotio/.github#actionsscan), runs
  Actionlint and Zizmor when a push to `main` changes `.github/`, and on every
  manual dispatch. GitHub secret scanning and push protection cover secrets.

## Delivery

Pull requests squash-merge to `main`, and a merge runs CI only. The manual
store submission is `pnpm run publish`, which runs `ray publish` from the
locked `@raycast/api` and opens a pull request in Raycast's extensions
repository; users get the change only after Raycast reviews and merges it.
