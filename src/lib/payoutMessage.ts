import { formatCurrency, formatPlace } from "./format";
import type { PayoutCalculationResult, PayoutConfig } from "./payouts";

// Chat apps (iMessage, Sleeper) render plain proportional text, so the
// message is line-based rather than column-aligned.
export function formatPayoutMessage(
  config: PayoutConfig,
  result: PayoutCalculationResult,
): string {
  const entriesLabel = config.entrants === 1 ? "entry" : "entries";
  const header = [
    `${formatCurrency(result.totalPool)} pool`,
    `${config.entrants} ${entriesLabel}`,
    `${formatCurrency(config.buyIn)} buy-in`,
  ].join(" · ");

  const lines = result.payouts.map(
    (row) => `${formatPlace(row.place)} — ${formatCurrency(row.payout)}`,
  );

  return `${header}\n\n${lines.join("\n")}`;
}
