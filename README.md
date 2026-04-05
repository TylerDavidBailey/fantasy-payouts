# Fantasy Payouts

Fantasy Payouts is a static React application for calculating prize splits for
fantasy leagues, tournament pools, survivor contests, and similar payout-based
formats.

It stays fully client-side, updates results instantly, and encodes the current
calculator state in the URL so a payout setup can be shared with a link.

## Features

- Calculate payouts from entrants, buy-in, paid spots, and a top-heaviness
  factor
- Keep the total prize pool fully allocated across paid places
- Generate shareable URLs from the current calculator state
- Run as a simple static site with no backend or database

## Tech stack

- React 18
- TypeScript
- Vite
- ESLint
- Vitest
- GitHub Actions

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm

### Install dependencies

```bash
make install
```

### Start the development server

```bash
make dev
```

If you prefer using `npm` directly, the equivalent command is:

```bash
npm run dev
```

## Available commands

### Make targets

```bash
make help
make install
make dev
make lint
make typecheck
make test
make test-watch
make build
make preview
make check
make clean
```

### npm scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run build
npm run preview
npm run check
```

## Quality checks

The main local quality gate is:

```bash
make check
```

That runs:

- ESLint with warnings treated as failures
- TypeScript type checking
- Vitest unit tests
- Production build validation

CI runs the same validation on pull requests and pushes to `main`.

## Project structure

```text
src/
  App.tsx
  main.tsx
  styles.css
  lib/
    payouts.ts
    payouts.test.ts
```

### Key files

- `src/App.tsx`: calculator UI and state management
- `src/lib/payouts.ts`: payout calculation and input sanitization logic
- `src/lib/payouts.test.ts`: unit tests for payout behavior
- `src/styles.css`: application styling
- `Makefile`: local developer task entry points

## Deployment

Production assets are built with:

```bash
make build
```

The repository includes GitHub Actions workflows for:

- CI validation
- GitHub Pages deployment from `main`

If this repository is deployed as a GitHub project site, set the Vite `base`
option in `vite.config.ts` to the repository path:

```ts
base: "/fantasy-payouts/";
```

If it is deployed as a user or organization site, the current base setting may
already be sufficient.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development expectations, local
validation steps, and pull request guidance.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
