import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SummaryStats from "./SummaryStats";

const result = {
  totalPool: 1000,
  payouts: [
    { place: 1, percentage: 0.6, payout: 600 },
    { place: 2, percentage: 0.25, payout: 250 },
    { place: 3, percentage: 0.15, payout: 150 },
  ],
};

function statFor(label: string): HTMLElement {
  const stat = screen.getByText(label).closest(".stat");

  if (!(stat instanceof HTMLElement)) {
    throw new Error(`No stat found for ${label}`);
  }

  return stat;
}

describe("SummaryStats", () => {
  it("summarizes the prize structure", () => {
    render(<SummaryStats result={result} entrants={10} />);

    expect(statFor("Prize pool")).toHaveTextContent("$1,000");
    expect(statFor("First prize")).toHaveTextContent("$600");
    expect(statFor("Min cash")).toHaveTextContent("$150");
    expect(statFor("Field paid")).toHaveTextContent("30.0%");
  });

  it("handles an empty payout list without crashing", () => {
    render(<SummaryStats result={{ totalPool: 0, payouts: [] }} entrants={0} />);

    expect(statFor("Prize pool")).toHaveTextContent("$0");
    expect(statFor("First prize")).toHaveTextContent("$0");
    expect(statFor("Field paid")).toHaveTextContent("0.0%");
  });
});
