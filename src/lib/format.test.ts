import { describe, expect, it } from "vitest";
import { formatCurrency, formatPercent, formatPlace } from "./format";

describe("formatCurrency", () => {
  it("formats whole-dollar USD amounts", () => {
    expect(formatCurrency(0)).toBe("$0");
    expect(formatCurrency(1250)).toBe("$1,250");
  });
});

describe("formatPercent", () => {
  it("formats fractions with one decimal place", () => {
    expect(formatPercent(0.5)).toBe("50.0%");
    expect(formatPercent(0.333)).toBe("33.3%");
  });

  it("never shows a nonzero share as 0.0%", () => {
    expect(formatPercent(0.0004)).toBe("<0.1%");
    expect(formatPercent(0.0005)).toBe("0.1%");
    expect(formatPercent(0)).toBe("0.0%");
  });
});

describe("formatPlace", () => {
  it("uses English ordinal suffixes", () => {
    expect(formatPlace(1)).toBe("1st");
    expect(formatPlace(2)).toBe("2nd");
    expect(formatPlace(3)).toBe("3rd");
    expect(formatPlace(4)).toBe("4th");
    expect(formatPlace(11)).toBe("11th");
    expect(formatPlace(12)).toBe("12th");
    expect(formatPlace(13)).toBe("13th");
    expect(formatPlace(21)).toBe("21st");
    expect(formatPlace(22)).toBe("22nd");
    expect(formatPlace(23)).toBe("23rd");
    expect(formatPlace(101)).toBe("101st");
    expect(formatPlace(111)).toBe("111th");
  });
});
