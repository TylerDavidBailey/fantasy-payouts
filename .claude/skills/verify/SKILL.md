---
name: verify
description: How to launch and drive this app to verify a change end-to-end.
---

# Verifying fantasy-payouts

Static React SPA; the whole surface is one page driven by URL params.

## Launch

```bash
npx vite --port 5199 --strictPort   # run in background; ready in ~1s
```

## Drive

No Playwright in the repo. Install `playwright-core` in a scratch dir and
launch the locally installed Chrome — no browser download needed:

```js
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
```

Useful handles:

- Inputs: `page.getByLabel(/buy-in/i)`, `/^entries$/i`, `/payout spots/i`.
  `NumberField` commits on every keystroke and snaps to the sanitized value
  on blur — use `pressSequentially`, then `.blur()` to observe sanitization.
- Read results: `.header-meta` (entries · buy-in), the "Prize pool" stat
  block, and the payout list (`role="list"` named "Payout results").
- State round-trips: set config via query string, e.g.
  `/?entrants=100&buyIn=10&paidSpots=7&exponent=1.10`; the app normalizes
  the URL via `replaceState` on load.

## Flows worth driving

- Default load → pool/rows render, payouts sum exactly to the pool.
- Fractional buy-in (5.55) → cent-accurate rows, URL param `buyIn=5.55`.
- Direct load with un-normalized params (`?buyIn=5.50`) → normalizes to `5.5`.
- Sanitization probes: sub-minimum buy-in (0.50 → snaps to 1 on blur),
  3-decimal entry (5.555 → rounds to cent), garbage text (ignored).
- Regression sweep: `body.innerText` should never match `/\$[\d,]+\.\d(?!\d)/`
  (no single-decimal currency strings).
