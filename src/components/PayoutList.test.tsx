import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PayoutList from "./PayoutList";

const payouts = [
  { place: 1, percentage: 0.5, payout: 500 },
  { place: 2, percentage: 0.25, payout: 250 },
  { place: 3, percentage: 0.15, payout: 150 },
  { place: 4, percentage: 0.1, payout: 100 },
];

describe("PayoutList", () => {
  it("renders one row per payout with place, percentage, and amount", () => {
    render(<PayoutList payouts={payouts} />);

    const rows = screen.getAllByRole("listitem");

    expect(rows).toHaveLength(4);
    expect(rows[0]).toHaveTextContent("1st");
    expect(rows[0]).toHaveTextContent("50.0%");
    expect(rows[0]).toHaveTextContent("$500");
    expect(rows[3]).toHaveTextContent("4th");
    expect(rows[3]).toHaveTextContent("$100");
  });

  it("highlights only the podium places", () => {
    render(<PayoutList payouts={payouts} />);

    expect(screen.getByText("1st")).toHaveClass("is-gold");
    expect(screen.getByText("2nd")).toHaveClass("is-silver");
    expect(screen.getByText("3rd")).toHaveClass("is-bronze");
    expect(screen.getByText("4th").className.trim()).toBe("payout-place");
  });

  it("scales bars relative to the first-place payout", () => {
    const { container } = render(<PayoutList payouts={payouts} />);

    const widths = Array.from(container.querySelectorAll<HTMLElement>(".payout-fill")).map(
      (fill) => fill.style.width,
    );

    expect(widths).toEqual(["100%", "50%", "30%", "20%"]);
  });

  it("renders nothing for an empty payout list", () => {
    render(<PayoutList payouts={[]} />);

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });
});
