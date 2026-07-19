# Fantasy Payouts

A small client-side web app for calculating payout splits for fantasy leagues,
pools, and similar contests. Live at
[tylerdavidbailey.github.io/fantasy-payouts](https://tylerdavidbailey.github.io/fantasy-payouts/).

Set the number of entries, buy-in, and payout spots, then tune how top-heavy
the prize curve is. Payouts are weighted with `1 / place^k` and always
distribute the full pool to the cent, descending by place. Results can be
copied as a chat-ready message, and the current calculator state lives in the
URL, so any configuration can be shared as a link.

Built with React, TypeScript, and Vite. No backend, no data stored.

## Development

Requires Node 22.14+.

```sh
make install   # install dependencies (npm ci)
make dev       # start the Vite dev server
make check     # full quality gate: lint, typecheck, test, build, audit
```

Run `make` with no arguments to list all targets, including `test-watch`,
`coverage`, and `preview`.

### Layout

- `src/lib/` — pure payout math, formatting, and URL state (fully unit tested)
- `src/components/` — presentational React components
- `src/App.tsx` — state and composition

## Releases and deployment

Merges to `main` run CI, then semantic-release calculates the next version
from [Conventional Commit](https://www.conventionalcommits.org/) messages
(`feat: …`, `fix: …`, `feat!: …`), pushes the `vX.Y.Z` tag, and publishes a
GitHub release with generated notes. Nothing is committed back to `main`, so
release notes live on the GitHub Releases page. A successful CI run on `main`
also deploys the app to GitHub Pages.
