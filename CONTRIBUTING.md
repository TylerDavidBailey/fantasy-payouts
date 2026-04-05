# Contributing

## Development workflow

1. Install dependencies with `make install`.
2. Start the app locally with `make dev`.
3. Run the full quality gate with `make check` before opening a pull request.

## Project standards

- Keep the app static and client-side unless a change explicitly requires otherwise.
- Preserve the existing product behavior unless the pull request is intentionally fixing a bug.
- Prefer small, focused pull requests with clear rationale and test coverage when behavior changes.
- Follow the current stack and conventions: React, TypeScript, Vite, ESLint, and Vitest.

## Pull requests

- Use a descriptive branch name and pull request title.
- Summarize the change, testing performed, and any deployment impact.
- Include screenshots or short recordings for visible UI changes.
- Update docs when local commands, project setup, or public behavior changes.

## Validation

The main local commands are:

```bash
make lint
make typecheck
make test
make build
make check
```

`make check` is the canonical pre-PR validation step and matches the CI quality gate.
