# Contributing

## Setup

```bash
pnpm install
pnpm run hooks:install
```

`hooks:install` adds a pre-push hook that runs `pnpm run verify`.

## Validation

Run `pnpm run verify` before opening a pull request. `pnpm run lint` uses
Raycast's relaxed mode because strict lockfile validation accepts only npm
lockfiles.

When the change affects runtime behavior, smoke test the affected command in
Raycast with `pnpm run dev`. It acts on the real put.io account in your
extension preferences. If it touches API behavior, auth, or result rendering,
include the exact user flow you checked. Changes to the account error view
also need a keyboard and VoiceOver check of Retry and Open Extension
Preferences.
