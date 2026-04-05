import { describe, expect, it } from "vitest";
import {
  calculatePayouts,
  clampDisplayedExponent,
  clampPaidSpots,
  defaultPreset,
  minDisplayedExponent,
  readInitialPreset,
  sanitizeBuyIn,
  sanitizeExponent,
  sanitizeEntrants,
  sanitizePaidSpots,
} from "./payouts";

describe("clampPaidSpots", () => {
  it("never returns less than one", () => {
    expect(clampPaidSpots(0, 12)).toBe(1);
  });

  it("never returns more than the number of entrants", () => {
    expect(clampPaidSpots(10, 4)).toBe(4);
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
    expect(sanitizeEntrants(Infinity)).toBe(defaultPreset.entrants);
  });

  it("sanitizes buy-in to a minimum positive integer", () => {
    expect(sanitizeBuyIn(-50)).toBe(1);
    expect(sanitizeBuyIn(25.7)).toBe(25);
    expect(sanitizeBuyIn(NaN)).toBe(defaultPreset.buyIn);
  });

  it("sanitizes paid spots against entrant count", () => {
    expect(sanitizePaidSpots(300, 10)).toBe(10);
    expect(sanitizePaidSpots(0, 10)).toBe(1);
  });

  it("sanitizes exponent values", () => {
    expect(sanitizeExponent(-5)).toBe(minDisplayedExponent);
    expect(sanitizeExponent(Infinity)).toBe(defaultPreset.exponent);
  });
});

describe("calculatePayouts", () => {
  it("allocates the full prize pool", () => {
    const result = calculatePayouts(152, 25, 12, 0.9);
    const allocated = result.payouts.reduce((sum, row) => sum + row.payout, 0);

    expect(result.totalPool).toBe(3800);
    expect(allocated).toBe(3800);
  });

  it("creates equal payouts when the exponent is zero", () => {
    const result = calculatePayouts(12, 50, 3, 0);

    expect(result.payouts[0].payout).toBeGreaterThan(result.payouts[1].payout);
    expect(result.payouts[1].payout).toBeGreaterThan(result.payouts[2].payout);
  });

  it("gives first place more money in a top-heavy structure", () => {
    const result = calculatePayouts(12, 50, 3, 1.2);

    expect(result.payouts[0].payout).toBeGreaterThan(result.payouts[1].payout);
    expect(result.payouts[1].payout).toBeGreaterThan(result.payouts[2].payout);
  });

  it("caps paid spots to entrants", () => {
    const result = calculatePayouts(3, 20, 8, 0.75);

    expect(result.payouts).toHaveLength(3);
  });

  it("sanitizes invalid input values before calculating", () => {
    const result = calculatePayouts(0, -25, 300, 0.9);

    expect(result.totalPool).toBe(1);
    expect(result.payouts).toHaveLength(1);
  });

  it("sanitizes extreme and invalid exponent values before calculating", () => {
    const low = calculatePayouts(10, 100, 3, -100);
    const invalid = calculatePayouts(10, 100, 3, Number.NaN);

    expect(low.payouts[0].payout).toBeGreaterThan(low.payouts[1].payout);
    expect(invalid.payouts).toHaveLength(3);
  });
});

describe("readInitialPreset", () => {
  it("uses defaults when the query string is empty", () => {
    expect(readInitialPreset("")).toEqual(defaultPreset);
  });

  it("reads values from the query string", () => {
    expect(readInitialPreset("?entrants=10&buyIn=15&paidSpots=2&exponent=1.25")).toEqual({
      name: "Custom",
      entrants: 10,
      buyIn: 15,
      paidSpots: 2,
      exponent: 1.25,
    });
  });

  it("clamps URL exponents below the UI minimum", () => {
    expect(readInitialPreset("?exponent=0").exponent).toBe(minDisplayedExponent);
  });

  it("sanitizes invalid query string values", () => {
    expect(readInitialPreset("?entrants=0&buyIn=-20&paidSpots=300")).toEqual({
      name: "Custom",
      entrants: 1,
      buyIn: 1,
      paidSpots: 1,
      exponent: defaultPreset.exponent,
    });
  });

  it("sanitizes extreme and invalid query string values", () => {
    expect(readInitialPreset("?entrants=999999&buyIn=999999999&paidSpots=999999&exponent=Infinity")).toEqual({
      name: "Custom",
      entrants: 999999,
      buyIn: 999999999,
      paidSpots: 999999,
      exponent: defaultPreset.exponent,
    });
  });
});
