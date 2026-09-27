# Contributing

## Setup

```bash
pnpm install
pnpm run hooks:install
```

`hooks:install` points Git at `.git-hooks/`, whose pre-push hook runs
`pnpm run verify`.

Commands and metadata live in the [extension manifest](./package.json); source
lives in `src/`. Publishing goes through Raycast's tooling (`pnpm run publish`).

## Validation

Run `pnpm run verify` before opening a pull request. CI runs the same gate
after `pnpm install --frozen-lockfile` on the Node.js version in
[`.node-version`](./.node-version). The chain is `scripts.verify` in
[package.json](./package.json). Two parts are non-obvious:

- `pnpm run lint` uses Raycast's relaxed mode because strict lockfile
  validation accepts only npm lockfiles.
- `pnpm test` runs the account-bootstrap lifecycle tests with real React and
  Raycast server-state hooks.

When the change affects runtime behavior, smoke test the affected command in
Raycast with `pnpm run dev`. If it touches API behavior, auth, or result
rendering, include the exact user flow you checked.

## Account Bootstrap Checks

The tests mock the Raycast host and account API boundary while running the
installed `usePromise` hook and React renderer. They cover recovery and
credential changes but do not replace a check in Raycast:

- A pending account lookup shows loading, then stops loading on a rejected
  credential or network failure.
- The error view offers Retry and Open Extension Preferences.
- After changing the app-specific password, Retry opens the command with the
  new account.
- Keyboard navigation and VoiceOver announcements work on the error actions.

## Pull Requests

- Attach screenshots or recordings for changed command UI with
  `gh pr create --attach ./file.png` or `gh pr comment <n> --attach ./file.mp4`;
  do not commit them.
- Note auth and put.io API checks when relevant.
- Note when a change needs a store publish or updated store metadata.
