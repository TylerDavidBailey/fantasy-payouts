# Fantasy Payouts

Client-side payout calculator (React + TypeScript + Vite). No backend; state lives in the URL.

## Commands

- `make check` — full gate: lint, typecheck, test, build, audit. Run before finishing any change.
- `make test` / `make test-watch` / `make coverage` — Vitest (jsdom + Testing Library for components).
- `make dev` — dev server at http://localhost:5173.

## Structure

- `src/lib/` — pure logic: payout math (`payouts.ts`), formatting, URL state. Keep this free of React.
- `src/components/` — presentational components; `src/App.tsx` owns state and composition.

## Conventions

- All money math is whole dollars; payouts must always sum to the pool and descend by place.
- Sanitize inputs through the `sanitize*` helpers in `src/lib/payouts.ts`; never trust raw values.
- PR titles and commits use Conventional Commits — releases and Pages deploys are automated from `main` via semantic-release.
