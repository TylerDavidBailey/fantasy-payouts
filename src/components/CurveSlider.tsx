import { maxDisplayedExponent, minDisplayedExponent } from "../lib/payouts";

type CurveSliderProps = {
  exponent: number;
  onCommit: (value: number) => void;
};

function describeCurve(exponent: number): string {
  if (exponent < 0.5) {
    return "Nearly even";
  }

  if (exponent < 0.9) {
    return "Balanced";
  }

  if (exponent < 1.3) {
    return "Standard";
  }

  if (exponent < 1.7) {
    return "Top-heavy";
  }

  return "Winner-heavy";
}

function CurveSlider({ exponent, onCommit }: CurveSliderProps): JSX.Element {
  return (
    <label className="field slider-field">
      <span className="field-label">Payout curve</span>
      <div className="slider-header">
        <strong>{describeCurve(exponent)}</strong>
        <span className="slider-value">k = {exponent.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={String(minDisplayedExponent)}
        max={String(maxDisplayedExponent)}
        step="0.05"
        value={exponent}
        onChange={(event) => onCommit(Number(event.target.value))}
      />
      <div className="slider-scale">
        <small>Flatter</small>
        <small>Steeper</small>
      </div>
    </label>
  );
}

export default CurveSlider;
