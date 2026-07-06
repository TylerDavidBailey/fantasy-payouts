import { describe, expect, it } from "vitest";
import { formatPayoutMessage } from "./payoutMessage";
import { calculatePayouts, type PayoutConfig } from "./payouts";

function messageFor(config: PayoutConfig): string {
  return formatPayoutMessage(config, calculatePayouts(config));
}

describe("formatPayoutMessage", () => {
  it("formats the default config as a chat-friendly message", () => {
    const config: PayoutConfig = { entrants: 10, buyIn: 100, paidSpots: 3, exponent: 1 };

    expect(messageFor(config)).toBe(
      [
        "$1,000 pool - 10 entries - $100 buy-in",
        "",
        "1st: $544.82",
        "2nd: $272.91",
        "3rd: $182.27",
      ].join("\n"),
    );
  });

  it("lists every paid place on its own line", () => {
    const config: PayoutConfig = { entrants: 20, buyIn: 50, paidSpots: 5, exponent: 1 };
    const lines = messageFor(config).split("\n");

    expect(lines).toHaveLength(7);
    expect(lines[2]).toMatch(/^1st: \$/);
    expect(lines[6]).toMatch(/^5th: \$/);
  });

  it("uses the singular label for a single entry", () => {
    const config: PayoutConfig = { entrants: 1, buyIn: 25, paidSpots: 1, exponent: 1 };

    expect(messageFor(config)).toBe(
      ["$25 pool - 1 entry - $25 buy-in", "", "1st: $25"].join("\n"),
    );
  });

  it("shows cents in the buy-in and payouts when present", () => {
    const config: PayoutConfig = { entrants: 3, buyIn: 5.5, paidSpots: 2, exponent: 1 };
    const message = messageFor(config);

    expect(message).toContain("$5.50 buy-in");
    expect(message).toContain("1st: $10.67");
    expect(message).toContain("2nd: $5.83");
  });
});
