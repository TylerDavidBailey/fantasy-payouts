import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculatePayouts,
  maxDisplayedExponent,
  minDisplayedExponent,
  readInitialPreset,
  sanitizeBuyIn,
  sanitizeEntrants,
  sanitizeExponent,
  sanitizePaidSpots,
} from "./lib/payouts";

type CopyStatus = "idle" | "success" | "error";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const copyStatusLabel: Record<CopyStatus, string> = {
  idle: "Copy share link",
  success: "Link copied",
  error: "Copy failed",
};

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function placeLabel(place: number): string {
  if (place % 10 === 1 && place % 100 !== 11) {
    return `${place}st`;
  }

  if (place % 10 === 2 && place % 100 !== 12) {
    return `${place}nd`;
  }

  if (place % 10 === 3 && place % 100 !== 13) {
    return `${place}rd`;
  }

  return `${place}th`;
}

function App(): JSX.Element {
  const initialPreset = useMemo(() => readInitialPreset(window.location.search), []);
  const [entrants, setEntrants] = useState(initialPreset.entrants);
  const [buyIn, setBuyIn] = useState(initialPreset.buyIn);
  const [paidSpots, setPaidSpots] = useState(initialPreset.paidSpots);
  const [entrantsInput, setEntrantsInput] = useState(String(initialPreset.entrants));
  const [buyInInput, setBuyInInput] = useState(String(initialPreset.buyIn));
  const [paidSpotsInput, setPaidSpotsInput] = useState(String(initialPreset.paidSpots));
  const [exponent, setExponent] = useState(initialPreset.exponent);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyStatusTimeoutRef = useRef<number | null>(null);

  const payouts = useMemo(
    () => calculatePayouts(entrants, buyIn, paidSpots, exponent),
    [entrants, buyIn, paidSpots, exponent],
  );

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("entrants", String(entrants));
    params.set("buyIn", String(buyIn));
    params.set("paidSpots", String(paidSpots));
    params.set("exponent", exponent.toFixed(2));

    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", nextUrl);
  }, [entrants, buyIn, paidSpots, exponent]);

  useEffect(() => {
    return () => {
      if (copyStatusTimeoutRef.current !== null) {
        window.clearTimeout(copyStatusTimeoutRef.current);
      }
    };
  }, []);

  const firstPlacePayout = payouts.payouts[0]?.payout ?? 0;

  function resetCopyStatusAfterDelay(): void {
    if (copyStatusTimeoutRef.current !== null) {
      window.clearTimeout(copyStatusTimeoutRef.current);
    }

    copyStatusTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus("idle");
      copyStatusTimeoutRef.current = null;
    }, 1800);
  }

  function handleEntrantsChange(rawValue: string): void {
    setEntrantsInput(rawValue);

    if (rawValue.trim() === "") {
      return;
    }

    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed)) {
      return;
    }

    const nextEntrants = sanitizeEntrants(parsed);
    const nextPaidSpots = sanitizePaidSpots(paidSpots, nextEntrants);

    setEntrants(nextEntrants);
    setPaidSpots(nextPaidSpots);

    if (nextPaidSpots !== paidSpots) {
      setPaidSpotsInput(String(nextPaidSpots));
    }
  }

  function handleBuyInChange(rawValue: string): void {
    setBuyInInput(rawValue);

    if (rawValue.trim() === "") {
      return;
    }

    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed)) {
      return;
    }

    setBuyIn(sanitizeBuyIn(parsed));
  }

  function handlePaidSpotsChange(rawValue: string): void {
    setPaidSpotsInput(rawValue);

    if (rawValue.trim() === "") {
      return;
    }

    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed)) {
      return;
    }

    setPaidSpots(sanitizePaidSpots(parsed, entrants));
  }

  function handleExponentChange(rawValue: string): void {
    setExponent(sanitizeExponent(Number(rawValue)));
  }

  function handleEntrantsBlur(): void {
    setEntrantsInput(String(entrants));
  }

  function handleBuyInBlur(): void {
    setBuyInInput(String(buyIn));
  }

  function handlePaidSpotsBlur(): void {
    setPaidSpotsInput(String(paidSpots));
  }

  async function copyShareLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }

    resetCopyStatusAfterDelay();
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div className="page-title">
          <p className="eyebrow">Fantasy Payouts</p>
          <h1>Payout calculator</h1>
          <p className="hero-text">
            Simple payout splits for leagues and pools.
          </p>
        </div>
        <div className="page-actions">
          <p className="header-meta">
            {entrants} entries · {currencyFormatter.format(buyIn)} buy-in
          </p>
          <button
            type="button"
            className="action-primary"
            onClick={() => {
              void copyShareLink();
            }}
          >
            {copyStatusLabel[copyStatus]}
          </button>
        </div>
      </header>

      <section className="workspace">
        <section className="panel controls-panel">
          <div className="panel-heading">
            <p className="panel-tag">Inputs</p>
            <h2>League details</h2>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Number of entries</span>
              <input
                type="number"
                min="1"
                value={entrantsInput}
                onChange={(event) => handleEntrantsChange(event.target.value)}
                onBlur={handleEntrantsBlur}
              />
            </label>

            <label className="field">
              <span>Buy-in amount</span>
              <input
                type="number"
                min="1"
                step="1"
                value={buyInInput}
                onChange={(event) => handleBuyInChange(event.target.value)}
                onBlur={handleBuyInBlur}
              />
            </label>

            <label className="field">
              <span>Payout spots</span>
              <input
                type="number"
                min="1"
                max={entrants}
                value={paidSpotsInput}
                onChange={(event) => handlePaidSpotsChange(event.target.value)}
                onBlur={handlePaidSpotsBlur}
              />
            </label>
          </div>

          <label className="field slider-field">
            <span>Top-heaviness factor</span>
            <div className="slider-header">
              <small>Near-balanced</small>
              <strong>{exponent.toFixed(2)}</strong>
              <small>Winner-heavy</small>
            </div>
            <input
              type="range"
              min={String(minDisplayedExponent)}
              max={String(maxDisplayedExponent)}
              step="0.05"
              value={exponent}
              onChange={(event) => handleExponentChange(event.target.value)}
            />
          </label>

          <div className="formula-panel">
            <p className="panel-tag">Formula</p>
            <p>
              Payouts are weighted with <code>1 / place^k</code>. Higher <code>k</code> gives a
              bigger share to the top finishers while still paying out the full pool.
            </p>
          </div>
        </section>

        <section className="panel results-panel">
          <div className="panel-heading">
            <p className="panel-tag">Results</p>
            <h2>Payouts</h2>
          </div>

          <div className="result-header">
            <div>
              <span>Pool</span>
              <strong>{currencyFormatter.format(payouts.totalPool)}</strong>
            </div>
            <div>
              <span>First</span>
              <strong>{currencyFormatter.format(firstPlacePayout)}</strong>
            </div>
            <div>
              <span>Places paid</span>
              <strong>{payouts.payouts.length}</strong>
            </div>
          </div>

          <div className="payout-list" aria-label="Payout results">
            {payouts.payouts.map((row) => (
              <div key={row.place} className="payout-row">
                <div className="payout-main">
                  <strong>{placeLabel(row.place)}</strong>
                  <span>{formatPercent(row.percentage)}</span>
                </div>
                <div className="payout-track">
                  <div className="payout-fill" style={{ width: `${row.percentage * 100}%` }} />
                </div>
                <strong className="payout-value">{currencyFormatter.format(row.payout)}</strong>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
