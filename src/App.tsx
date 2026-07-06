import { useEffect, useMemo, useState } from "react";
import CopyButton from "./components/CopyButton";
import CurveSlider from "./components/CurveSlider";
import NumberField from "./components/NumberField";
import PayoutList from "./components/PayoutList";
import ShareButton from "./components/ShareButton";
import SummaryStats from "./components/SummaryStats";
import { formatCurrency } from "./lib/format";
import {
  calculatePayouts,
  maxBuyIn,
  maxEntrants,
  maxPaidSpots,
  minBuyIn,
  minEntrants,
  sanitizeBuyIn,
  sanitizeEntrants,
  sanitizeExponent,
  sanitizePaidSpots,
  type PayoutConfig,
} from "./lib/payouts";
import { formatPayoutMessage } from "./lib/payoutMessage";
import { configFromSearch, configToSearch } from "./lib/urlState";

function App(): JSX.Element {
  const [config, setConfig] = useState<PayoutConfig>(() =>
    configFromSearch(window.location.search),
  );

  const result = useMemo(() => calculatePayouts(config), [config]);

  useEffect(() => {
    const nextUrl = `${window.location.pathname}?${configToSearch(config)}`;
    window.history.replaceState({}, "", nextUrl);
  }, [config]);

  function updateEntrants(value: number): void {
    setConfig((previous) => {
      const entrants = sanitizeEntrants(value);

      return {
        ...previous,
        entrants,
        paidSpots: sanitizePaidSpots(previous.paidSpots, entrants),
      };
    });
  }

  function updateBuyIn(value: number): void {
    setConfig((previous) => ({ ...previous, buyIn: sanitizeBuyIn(value) }));
  }

  function updatePaidSpots(value: number): void {
    setConfig((previous) => ({
      ...previous,
      paidSpots: sanitizePaidSpots(value, previous.entrants),
    }));
  }

  function updateExponent(value: number): void {
    setConfig((previous) => ({ ...previous, exponent: sanitizeExponent(value) }));
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Fantasy Payouts</p>
        <h1>Payout calculator</h1>
        <p className="hero-text">Simple payout splits for leagues and pools.</p>
        <p className="header-meta">
          {config.entrants} entries · {formatCurrency(config.buyIn)} buy-in
        </p>
      </header>

      <div className="workspace">
        <section className="controls" aria-label="Settings">
          <div className="controls-fields">
            <NumberField
              label="Entries"
              value={config.entrants}
              min={minEntrants}
              max={maxEntrants}
              onCommit={updateEntrants}
            />
            <NumberField
              label="Buy-in"
              value={config.buyIn}
              min={minBuyIn}
              max={maxBuyIn}
              step={0.01}
              prefix="$"
              onCommit={updateBuyIn}
            />
            <NumberField
              label="Payout spots"
              value={config.paidSpots}
              min={1}
              max={Math.min(config.entrants, maxPaidSpots)}
              onCommit={updatePaidSpots}
            />
            <CurveSlider exponent={config.exponent} onCommit={updateExponent} />
          </div>
        </section>

        <section className="slip" aria-label="Payout calculator">
          <div className="slip-header">
            <div>
              <p className="slip-tag">Results</p>
              <h2>Payouts</h2>
            </div>
            <div className="slip-actions">
              <CopyButton text={formatPayoutMessage(config, result)} />
              <ShareButton />
            </div>
          </div>

          <SummaryStats result={result} entrants={config.entrants} />
          <hr className="tear-line" aria-hidden="true" />
          <PayoutList payouts={result.payouts} />
        </section>
      </div>
    </main>
  );
}

export default App;
