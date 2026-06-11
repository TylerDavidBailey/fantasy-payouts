import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CurveSlider from "./CurveSlider";

describe("CurveSlider", () => {
  it.each([
    [0.3, "Nearly even"],
    [0.8, "Balanced"],
    [1.1, "Standard"],
    [1.5, "Top-heavy"],
    [1.9, "Winner-heavy"],
  ])("describes an exponent of %f as %s", (exponent, description) => {
    render(<CurveSlider exponent={exponent} onCommit={vi.fn()} />);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it("shows the exact exponent value", () => {
    render(<CurveSlider exponent={1.1} onCommit={vi.fn()} />);

    expect(screen.getByText("k = 1.10")).toBeInTheDocument();
  });

  it("commits slider changes as numbers", () => {
    const onCommit = vi.fn();
    render(<CurveSlider exponent={1.1} onCommit={onCommit} />);

    fireEvent.change(screen.getByRole("slider"), { target: { value: "1.5" } });

    expect(onCommit).toHaveBeenCalledWith(1.5);
  });
});
