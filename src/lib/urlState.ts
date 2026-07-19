import {
  defaultConfig,
  sanitizeBuyIn,
  sanitizeEntrants,
  sanitizeExponent,
  sanitizePaidSpots,
  type PayoutConfig,
} from "./payouts";

function readNumberParam(
  params: URLSearchParams,
  key: string,
  fallback: number,
  sanitize: (value: number) => number,
): number {
  const raw = params.get(key);

  // A present-but-empty param means missing, not zero (`Number("") === 0`).
  return raw === null || raw.trim() === "" ? sanitize(fallback) : sanitize(Number(raw));
}

export function configFromSearch(search: string): PayoutConfig {
  const params = new URLSearchParams(search);
  const entrants = readNumberParam(params, "entrants", defaultConfig.entrants, sanitizeEntrants);

  return {
    entrants,
    buyIn: readNumberParam(params, "buyIn", defaultConfig.buyIn, sanitizeBuyIn),
    paidSpots: readNumberParam(params, "paidSpots", defaultConfig.paidSpots, (value) =>
      sanitizePaidSpots(value, entrants),
    ),
    exponent: readNumberParam(params, "exponent", defaultConfig.exponent, sanitizeExponent),
  };
}

export function configToSearch(config: PayoutConfig): string {
  const params = new URLSearchParams();
  params.set("entrants", String(config.entrants));
  params.set("buyIn", String(config.buyIn));
  params.set("paidSpots", String(config.paidSpots));
  params.set("exponent", config.exponent.toFixed(2));

  return params.toString();
}
