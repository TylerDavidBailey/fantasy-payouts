import { presets, type PayoutConfig, type Preset } from "../lib/payouts";

type PresetPickerProps = {
  config: PayoutConfig;
  onSelect: (preset: Preset) => void;
};

function matchesConfig(preset: Preset, config: PayoutConfig): boolean {
  return (
    preset.entrants === config.entrants &&
    preset.buyIn === config.buyIn &&
    preset.paidSpots === config.paidSpots &&
    preset.exponent === config.exponent
  );
}

function PresetPicker({ config, onSelect }: PresetPickerProps): JSX.Element {
  return (
    <div className="preset-picker" role="group" aria-label="Presets">
      {presets.map((preset) => (
        <button
          key={preset.name}
          type="button"
          className={matchesConfig(preset, config) ? "preset-chip is-active" : "preset-chip"}
          onClick={() => onSelect(preset)}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
}

export default PresetPicker;
