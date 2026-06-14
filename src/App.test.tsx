import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

function payoutRows(): HTMLElement[] {
  return within(screen.getByRole("list", { name: /payout results/i })).getAllByRole("listitem");
}

describe("App", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("renders the default prize structure", () => {
    render(<App />);

    expect(screen.getByText("10 entries · $100 buy-in")).toBeInTheDocument();
    expect(payoutRows()).toHaveLength(3);
    expect(
      within(screen.getByText("Prize pool").closest("div")!).getByText("$1,000"),
    ).toBeInTheDocument();
  });

  it("initializes from URL parameters", () => {
    window.history.replaceState({}, "", "/?entrants=8&buyIn=10&paidSpots=2&exponent=1.00");

    render(<App />);

    expect(screen.getByText("8 entries · $10 buy-in")).toBeInTheDocument();
    expect(payoutRows()).toHaveLength(2);
  });

  it("keeps the URL in sync with the current config", async () => {
    const user = userEvent.setup();
    render(<App />);

    const entries = screen.getByLabelText<HTMLInputElement>(/^entries$/i);
    await user.clear(entries);
    await user.type(entries, "25");

    expect(new URLSearchParams(window.location.search).get("entrants")).toBe("25");
  });

  it("clamps payout spots when entries drop below them", async () => {
    const user = userEvent.setup();
    render(<App />);

    const entries = screen.getByLabelText<HTMLInputElement>(/^entries$/i);
    await user.clear(entries);
    await user.type(entries, "2");

    expect(screen.getByLabelText<HTMLInputElement>(/payout spots/i)).toHaveValue(2);
    expect(payoutRows()).toHaveLength(2);
  });

  it("recalculates when the buy-in changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    const buyIn = screen.getByLabelText<HTMLInputElement>(/buy-in/i);
    await user.clear(buyIn);
    await user.type(buyIn, "50");

    expect(screen.getByText("10 entries · $50 buy-in")).toBeInTheDocument();
    expect(
      within(screen.getByText("Prize pool").closest("div")!).getByText("$500"),
    ).toBeInTheDocument();
  });

  it("recalculates when the payout curve changes", () => {
    render(<App />);

    const before = payoutRows()[0].textContent;
    fireEvent.change(screen.getByRole("slider"), { target: { value: "2" } });

    expect(payoutRows()[0].textContent).not.toBe(before);
    expect(new URLSearchParams(window.location.search).get("exponent")).toBe("2.00");
  });

  it("never lets typed payout spots exceed the entrant count", async () => {
    const user = userEvent.setup();
    render(<App />);

    const spots = screen.getByLabelText<HTMLInputElement>(/payout spots/i);
    await user.clear(spots);
    await user.type(spots, "99");

    expect(payoutRows()).toHaveLength(10);
  });
});
