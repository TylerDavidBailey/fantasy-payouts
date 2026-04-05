export type Preset = {
  name: string;
  entrants: number;
  buyIn: number;
  paidSpots: number;
  exponent: number;
};

export type PayoutRow = {
  place: number;
  weight: number;
  percentage: number;
  payout: number;
};

export type PayoutCalculationResult = {
  totalPool: number;
  payouts: PayoutRow[];
};

export const defaultPreset: Preset = {
  name: "Custom",
  entrants: 10,
  buyIn: 100,
  paidSpots: 3,
  exponent: 1.1,
};

export const minDisplayedExponent = 0.15;
export const maxDisplayedExponent = 2;
export const minEntrants = 1;
export const maxEntrants = 10_000;
export const minBuyIn = 1;
export const maxBuyIn = 1_000_000;
export const maxPaidSpots = 1_000;

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
    return defaultPreset.exponent;
  }

  return clampDisplayedExponent(value);
}

export function sanitizeEntrants(value: number): number {
  if (!Number.isFinite(value)) {
    return defaultPreset.entrants;
  }

  return Math.min(Math.max(minEntrants, Math.floor(value)), maxEntrants);
}

export function sanitizeBuyIn(value: number): number {
  if (!Number.isFinite(value)) {
    return defaultPreset.buyIn;
  }

  return Math.min(Math.max(minBuyIn, Math.floor(value)), maxBuyIn);
}

export function sanitizePaidSpots(value: number, entrants: number): number {
  if (!Number.isFinite(value)) {
    return clampPaidSpots(defaultPreset.paidSpots, entrants);
  }

  return clampPaidSpots(value, entrants);
}

export function calculatePayouts(
  entrants: number,
  buyIn: number,
  paidSpots: number,
  exponent: number,
): PayoutCalculationResult {
  const safeEntrants = sanitizeEntrants(entrants);
  const safeBuyIn = sanitizeBuyIn(buyIn);
  const safeExponent = sanitizeExponent(exponent);
  const totalPool = Math.max(0, Math.round(safeEntrants * safeBuyIn));
  const safeSpots = sanitizePaidSpots(paidSpots, safeEntrants);
  const weights = Array.from(
    { length: safeSpots },
    (_, index) => 1 / Math.pow(index + 1, safeExponent),
  );
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);

  let remaining = totalPool;

  const payouts = weights.map((weight, index) => {
    const percentage = weight / weightSum;
    const payout = index === safeSpots - 1 ? remaining : Math.round(totalPool * percentage);
    remaining -= payout;

    return {
      place: index + 1,
      weight,
      percentage,
      payout,
    };
  });

  return { totalPool, payouts };
}

export function readInitialPreset(search: string): Preset {
  const params = new URLSearchParams(search);

  const entrantsValue = params.get("entrants");
  const entrants =
    entrantsValue === null ? defaultPreset.entrants : sanitizeEntrants(Number(entrantsValue));
  const buyInValue = params.get("buyIn");
  const buyIn = buyInValue === null ? defaultPreset.buyIn : sanitizeBuyIn(Number(buyInValue));
  const paidSpotsValue = params.get("paidSpots");
  const paidSpots = paidSpotsValue === null
    ? defaultPreset.paidSpots
    : sanitizePaidSpots(Number(paidSpotsValue), entrants);
  const exponentValue = params.get("exponent");
  const exponent = exponentValue === null
    ? defaultPreset.exponent
    : sanitizeExponent(Number(exponentValue));

  return {
    name: defaultPreset.name,
    entrants,
    buyIn,
    paidSpots,
    exponent,
  };
}
