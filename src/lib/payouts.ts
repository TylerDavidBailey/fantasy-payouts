export type PayoutConfig = {
  entrants: number;
  buyIn: number;
  paidSpots: number;
  exponent: number;
};

export type Preset = PayoutConfig & {
  name: string;
};

export type PayoutRow = {
  place: number;
  percentage: number;
  payout: number;
};

export type PayoutCalculationResult = {
  totalPool: number;
  payouts: PayoutRow[];
};

export const minDisplayedExponent = 0.15;
export const maxDisplayedExponent = 2;
export const minEntrants = 1;
export const maxEntrants = 10_000;
export const minBuyIn = 1;
export const maxBuyIn = 1_000_000;
export const maxPaidSpots = 1_000;

export const defaultConfig: PayoutConfig = {
  entrants: 10,
  buyIn: 100,
  paidSpots: 3,
  exponent: 1.1,
};

export const presets: Preset[] = [
  { name: "10-team league", entrants: 10, buyIn: 100, paidSpots: 3, exponent: 1.1 },
  { name: "12-team league", entrants: 12, buyIn: 50, paidSpots: 4, exponent: 1.1 },
  { name: "Office pool", entrants: 25, buyIn: 20, paidSpots: 5, exponent: 0.8 },
  { name: "Big tournament", entrants: 100, buyIn: 25, paidSpots: 10, exponent: 1.4 },
];

export function clampPaidSpots(paidSpots: number, entrants: number): number {
  return Math.min(
    Math.max(1, Math.floor(paidSpots)),
    sanitizeEntrants(entrants),
    maxPaidSpots,
  );
}

export function clampDisplayedExponent(exponent: number): number {
  return Math.min(Math.max(minDisplayedExponent, exponent), maxDisplayedExponent);
}

export function sanitizeExponent(value: number): number {
  if (!Number.isFinite(value)) {
    return defaultConfig.exponent;
  }

  return clampDisplayedExponent(value);
}

export function sanitizeEntrants(value: number): number {
  if (!Number.isFinite(value)) {
    return defaultConfig.entrants;
  }

  return Math.min(Math.max(minEntrants, Math.floor(value)), maxEntrants);
}

export function sanitizeBuyIn(value: number): number {
  if (!Number.isFinite(value)) {
    return defaultConfig.buyIn;
  }

  return Math.min(Math.max(minBuyIn, Math.floor(value)), maxBuyIn);
}

export function sanitizePaidSpots(value: number, entrants: number): number {
  if (!Number.isFinite(value)) {
    return clampPaidSpots(defaultConfig.paidSpots, entrants);
  }

  return clampPaidSpots(value, entrants);
}

export function sanitizeConfig(config: PayoutConfig): PayoutConfig {
  const entrants = sanitizeEntrants(config.entrants);

  return {
    entrants,
    buyIn: sanitizeBuyIn(config.buyIn),
    paidSpots: sanitizePaidSpots(config.paidSpots, entrants),
    exponent: sanitizeExponent(config.exponent),
  };
}

export function calculatePayouts(config: PayoutConfig): PayoutCalculationResult {
  const { entrants, buyIn, paidSpots, exponent } = sanitizeConfig(config);
  const totalPool = entrants * buyIn;
  const weights = Array.from(
    { length: paidSpots },
    (_, index) => 1 / Math.pow(index + 1, exponent),
  );
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);

  // Guarantee every paid spot at least $1, then split the rest by weight.
  // Sanitized inputs ensure totalPool >= paidSpots, so weightedPool >= 0.
  const weightedPool = totalPool - paidSpots;
  const basePayouts = weights.map(
    (weight) => Math.floor(weightedPool * (weight / weightSum)) + 1,
  );

  // Hand leftover dollars from flooring to the top places, one each, so the
  // distribution stays descending.
  const remainder = totalPool - basePayouts.reduce((sum, payout) => sum + payout, 0);

  const payouts = basePayouts.map((basePayout, index) => {
    const payout = basePayout + (index < remainder ? 1 : 0);

    return {
      place: index + 1,
      percentage: payout / totalPool,
      payout,
    };
  });

  return { totalPool, payouts };
}
