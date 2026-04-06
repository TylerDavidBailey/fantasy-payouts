# Fantasy Payouts

This repository contains a small web app for calculating payout splits for
fantasy leagues, pools, and similar contests.

The app is fully client-side and designed to make it easy to adjust common
payout inputs and see the resulting prize distribution immediately. It also
supports shareable calculator states, making it useful for league organizers or
anyone setting up prize structures.

The project is built as a lightweight React and TypeScript application with
Vite.

## Releases

This repository uses Conventional Commits plus semantic-release.

Merge commits to `main` with conventional messages such as:

- `feat: add payout presets`
- `fix: clamp invalid payout inputs`
- `feat!: change payout calculation defaults`

After CI succeeds on `main`, the release workflow automatically:

- calculates the next version from commit history
- creates a `vX.Y.Z` git tag
- publishes a GitHub release
- updates `CHANGELOG.md` and the package version in-repo
