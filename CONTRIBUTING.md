# Contributing

## Setup

```bash
pnpm install
pnpm run hooks:install
```

`hooks:install` enables the `.git-hooks/` pre-push hook, which runs
`pnpm run verify`.

## Validation

Run `pnpm run verify` before opening a pull request; CI runs the same gate.
`pnpm run lint` uses Raycast's relaxed mode because strict lockfile validation
accepts only npm lockfiles.

When the change affects runtime behavior, smoke test the affected command in
Raycast with `pnpm run dev`. It acts on the real put.io account in your
extension preferences. If it touches API behavior, auth, or result rendering,
include the exact user flow you checked. Changes to the account error view
also need a keyboard and VoiceOver check of Retry and Open Extension
Preferences.

## Pull Requests

- Attach screenshots or recordings for changed command UI with
  `gh pr create --attach ./file.png` or `gh pr comment <n> --attach ./file.mp4`;
  do not commit them.
- Note when a change needs a store publish (`pnpm run publish`) or updated
  store metadata.
