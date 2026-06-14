import { describe, expect, it } from "vitest";
import {
  calculatePayouts,
  clampDisplayedExponent,
  clampPaidSpots,
  defaultConfig,
  maxBuyIn,
  maxEntrants,
  maxPaidSpots,
  minDisplayedExponent,
  sanitizeBuyIn,
  sanitizeConfig,
  sanitizeEntrants,
  sanitizeExponent,
  sanitizePaidSpots,
  type PayoutConfig,
} from "./payouts";

function config(overrides: Partial<PayoutConfig>): PayoutConfig {
  return { ...defaultConfig, ...overrides };
}

describe("clampPaidSpots", () => {
  it("never returns less than one", () => {
    expect(clampPaidSpots(0, 12)).toBe(1);
  });

  it("never returns more than the number of entrants", () => {
    expect(clampPaidSpots(10, 4)).toBe(4);
  });

  it("never returns more than the maximum supported payout rows", () => {
    expect(clampPaidSpots(maxPaidSpots + 500, maxEntrants)).toBe(maxPaidSpots);
  });
});

describe("clampDisplayedExponent", () => {
  it("keeps the UI slider above a fully flat payout curve", () => {
    expect(clampDisplayedExponent(0)).toBe(minDisplayedExponent);
  });
});

describe("sanitizers", () => {
  it("sanitizes entrants to a minimum positive integer", () => {
    expect(sanitizeEntrants(0)).toBe(1);
    expect(sanitizeEntrants(12.9)).toBe(12);
    expect(sanitizeEntrants(Infinity)).toBe(defaultConfig.entrants);
    expect(sanitizeEntrants(maxEntrants + 1)).toBe(maxEntrants);
  });

  it("sanitizes buy-in to a minimum positive integer", () => {
    expect(sanitizeBuyIn(-50)).toBe(1);
    expect(sanitizeBuyIn(25.7)).toBe(25);
    expect(sanitizeBuyIn(NaN)).toBe(defaultConfig.buyIn);
    expect(sanitizeBuyIn(maxBuyIn + 1)).toBe(maxBuyIn);
  });

  it("sanitizes paid spots against entrant count", () => {
    expect(sanitizePaidSpots(300, 10)).toBe(10);
    expect(sanitizePaidSpots(0, 10)).toBe(1);
    expect(sanitizePaidSpots(maxPaidSpots + 1, maxEntrants)).toBe(maxPaidSpots);
    expect(sanitizePaidSpots(NaN, 10)).toBe(defaultConfig.paidSpots);
    expect(sanitizePaidSpots(NaN, 2)).toBe(2);
  });

  it("sanitizes exponent values", () => {
    expect(sanitizeExponent(-5)).toBe(minDisplayedExponent);
    expect(sanitizeExponent(Infinity)).toBe(defaultConfig.exponent);
  });

  it("sanitizes a whole config, clamping paid spots to entrants", () => {
    expect(sanitizeConfig({ entrants: 4, buyIn: -10, paidSpots: 9, exponent: NaN })).toEqual({
      entrants: 4,
      buyIn: 1,
      paidSpots: 4,
      exponent: defaultConfig.exponent,
    });
  });
});

describe("calculatePayouts", () => {
  it("allocates the full prize pool", () => {
    const result = calculatePayouts(
      config({ entrants: 152, buyIn: 25, paidSpots: 12, exponent: 0.9 }),
    );
    const allocated = result.payouts.reduce((sum, row) => sum + row.payout, 0);

    expect(result.totalPool).toBe(3800);
    expect(allocated).toBe(3800);
  });

  it("clamps a zero exponent to the minimum displayed top-heaviness", () => {
    const result = calculatePayouts(config({ entrants: 12, buyIn: 50, paidSpots: 3, exponent: 0 }));

    expect(result.payouts[0].payout).toBeGreaterThan(result.payouts[1].payout);
    expect(result.payouts[1].payout).toBeGreaterThan(result.payouts[2].payout);
  });

  it("gives first place more money in a top-heavy structure", () => {
    const result = calculatePayouts(
      config({ entrants: 12, buyIn: 50, paidSpots: 3, exponent: 1.2 }),
    );

    expect(result.payouts[0].payout).toBeGreaterThan(result.payouts[1].payout);
    expect(result.payouts[1].payout).toBeGreaterThan(result.payouts[2].payout);
  });

  it("caps paid spots to entrants", () => {
    const result = calculatePayouts(config({ entrants: 3, buyIn: 20, paidSpots: 8 }));

    expect(result.payouts).toHaveLength(3);
  });

  it("sanitizes invalid input values before calculating", () => {
    const result = calculatePayouts(
      config({ entrants: 0, buyIn: -25, paidSpots: 300, exponent: 0.9 }),
    );

    expect(result.totalPool).toBe(1);
    expect(result.payouts).toHaveLength(1);
  });

  it("keeps rounded payouts nonnegative and descending", () => {
    const result = calculatePayouts(config({ entrants: 7, buyIn: 3, paidSpots: 6, exponent: 2 }));
    const payouts = result.payouts.map((row) => row.payout);

    expect(payouts.reduce((sum, payout) => sum + payout, 0)).toBe(result.totalPool);
    expect(payouts.every((payout) => payout > 0)).toBe(true);

    for (let index = 1; index < payouts.length; index += 1) {
      expect(payouts[index]).toBeLessThanOrEqual(payouts[index - 1]);
    }
  });

  it("does not push rounding remainder into lower places", () => {
    const result = calculatePayouts(
      config({ entrants: 4, buyIn: 1, paidSpots: 3, exponent: minDisplayedExponent }),
    );
    const payouts = result.payouts.map((row) => row.payout);

    expect(payouts).toEqual([2, 1, 1]);
  });

  it("sanitizes extreme and invalid exponent values before calculating", () => {
    const low = calculatePayouts(config({ exponent: -100 }));
    const invalid = calculatePayouts(config({ exponent: Number.NaN }));

    expect(low.payouts[0].payout).toBeGreaterThan(low.payouts[1].payout);
    expect(invalid.payouts).toHaveLength(3);
  });

  it("pays the entire pool to first place when only one spot is paid", () => {
    const result = calculatePayouts(config({ entrants: 20, buyIn: 10, paidSpots: 1 }));

    expect(result.payouts).toEqual([{ place: 1, percentage: 1, payout: 200 }]);
  });

  it("handles the maximum supported configuration", () => {
    const result = calculatePayouts({
      entrants: maxEntrants,
      buyIn: maxBuyIn,
      paidSpots: maxPaidSpots,
      exponent: 2,
    });
    const payouts = result.payouts.map((row) => row.payout);

    expect(payouts).toHaveLength(maxPaidSpots);
    expect(payouts.reduce((sum, payout) => sum + payout, 0)).toBe(result.totalPool);
    expect(payouts.every((payout) => payout >= 1)).toBe(true);
  });

  it("allocates the full pool, descending, across a grid of configs", () => {
    for (const entrants of [2, 5, 9, 100]) {
      for (const buyIn of [1, 7, 250]) {
        for (const paidSpots of [1, 3, 10]) {
          for (const exponent of [minDisplayedExponent, 1, 2]) {
            const result = calculatePayouts({ entrants, buyIn, paidSpots, exponent });
            const payouts = result.payouts.map((row) => row.payout);

            expect(payouts.reduce((sum, payout) => sum + payout, 0)).toBe(result.totalPool);
            expect(payouts.every((payout) => payout >= 1)).toBe(true);

            for (let index = 1; index < payouts.length; index += 1) {
              expect(payouts[index]).toBeLessThanOrEqual(payouts[index - 1]);
            }
          }
        }
      }
    }
  });

  it("reports percentages that sum to one", () => {
    const result = calculatePayouts(
      config({ entrants: 33, buyIn: 17, paidSpots: 7, exponent: 1.35 }),
    );
    const percentageSum = result.payouts.reduce((sum, row) => sum + row.percentage, 0);

    expect(percentageSum).toBeCloseTo(1, 10);
  });
});
