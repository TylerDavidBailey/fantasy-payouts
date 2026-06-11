import { describe, expect, it } from "vitest";
import {
  defaultConfig,
  maxBuyIn,
  maxEntrants,
  maxPaidSpots,
  minDisplayedExponent,
} from "./payouts";
import { configFromSearch, configToSearch } from "./urlState";

describe("configFromSearch", () => {
  it("uses defaults when the query string is empty", () => {
    expect(configFromSearch("")).toEqual(defaultConfig);
  });

  it("reads values from the query string", () => {
    expect(configFromSearch("?entrants=10&buyIn=15&paidSpots=2&exponent=1.25")).toEqual({
      entrants: 10,
      buyIn: 15,
      paidSpots: 2,
      exponent: 1.25,
    });
  });

  it("clamps URL exponents below the UI minimum", () => {
    expect(configFromSearch("?exponent=0").exponent).toBe(minDisplayedExponent);
  });

  it("sanitizes invalid query string values", () => {
    expect(configFromSearch("?entrants=0&buyIn=-20&paidSpots=300")).toEqual({
      entrants: 1,
      buyIn: 1,
      paidSpots: 1,
      exponent: defaultConfig.exponent,
    });
  });

  it("clamps default paid spots when URL entrants are below the default", () => {
    expect(configFromSearch("?entrants=1")).toEqual({
      entrants: 1,
      buyIn: defaultConfig.buyIn,
      paidSpots: 1,
      exponent: defaultConfig.exponent,
    });
  });

  it("sanitizes extreme and invalid query string values", () => {
    expect(
      configFromSearch("?entrants=999999&buyIn=999999999&paidSpots=999999&exponent=Infinity"),
    ).toEqual({
      entrants: maxEntrants,
      buyIn: maxBuyIn,
      paidSpots: maxPaidSpots,
      exponent: defaultConfig.exponent,
    });
  });
});

describe("configToSearch", () => {
  it("serializes a config to query parameters", () => {
    expect(configToSearch({ entrants: 12, buyIn: 50, paidSpots: 4, exponent: 1.1 })).toBe(
      "entrants=12&buyIn=50&paidSpots=4&exponent=1.10",
    );
  });

  it("round-trips through configFromSearch", () => {
    const original = { entrants: 25, buyIn: 20, paidSpots: 5, exponent: 0.8 };

    expect(configFromSearch(`?${configToSearch(original)}`)).toEqual(original);
  });
});
