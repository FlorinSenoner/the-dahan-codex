# Agent Working Rules

## Commit and PR Conventions

- Use Conventional Commits for every commit message.
- Use a Conventional Commit title for every pull request title.
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
  `revert`.
- Format:
  - Commit: `<type>(optional-scope): <description>`
  - PR title: `<type>(optional-scope): <description>`
- Do not use custom prefixes like `[codex]` in PR titles.

Examples:

- `feat(nav): replace Notes tab with Home`
- `fix(hooks): add non-mise fallback for pre-push ci-parity`
