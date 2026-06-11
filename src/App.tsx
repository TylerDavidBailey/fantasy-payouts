import { useEffect, useMemo, useState } from "react";
import CurveSlider from "./components/CurveSlider";
import NumberField from "./components/NumberField";
import PayoutList from "./components/PayoutList";
import PresetPicker from "./components/PresetPicker";
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
  type Preset,
} from "./lib/payouts";
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

  function applyPreset(preset: Preset): void {
    setConfig({
      entrants: preset.entrants,
      buyIn: preset.buyIn,
      paidSpots: preset.paidSpots,
      exponent: preset.exponent,
    });
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Fantasy Payouts</p>
          <h1>Payout calculator</h1>
          <p className="hero-text">Simple payout splits for leagues and pools.</p>
        </div>
        <div className="page-actions">
          <p className="header-meta">
            {config.entrants} entries · {formatCurrency(config.buyIn)} buy-in
          </p>
          <ShareButton />
        </div>
      </header>

      <div className="workspace">
        <section className="panel controls-panel" aria-label="League details">
          <div className="panel-heading">
            <p className="panel-tag">Inputs</p>
            <h2>League details</h2>
          </div>

          <PresetPicker config={config} onSelect={applyPreset} />

          <div className="field-grid">
            <NumberField
              label="Number of entries"
              value={config.entrants}
              min={minEntrants}
              max={maxEntrants}
              onCommit={updateEntrants}
            />
            <NumberField
              label="Buy-in amount"
              value={config.buyIn}
              min={minBuyIn}
              max={maxBuyIn}
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
          </div>

          <CurveSlider exponent={config.exponent} onCommit={updateExponent} />

          <div className="formula-note">
            <p>
              Payouts are weighted with <code>1 / place^k</code>. A higher <code>k</code> gives a
              bigger share to top finishers while still paying out the full pool.
            </p>
          </div>
        </section>

        <section className="panel results-panel" aria-label="Payout results">
          <div className="panel-heading">
            <p className="panel-tag">Results</p>
            <h2>Payouts</h2>
          </div>

          <SummaryStats result={result} entrants={config.entrants} />
          <PayoutList payouts={result.payouts} />
        </section>
      </div>
    </main>
  );
}

export default App;
