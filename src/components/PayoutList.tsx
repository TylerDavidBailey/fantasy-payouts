import type { JSX } from "react";
import { formatCurrency, formatPercent, formatPlace } from "../lib/format";
import type { PayoutRow } from "../lib/payouts";

type PayoutListProps = {
  payouts: PayoutRow[];
};

function PayoutList({ payouts }: PayoutListProps): JSX.Element {
  const topPayout = payouts[0]?.payout ?? 0;

  return (
    <ol className="payout-list" aria-label="Payout results">
      {payouts.map((row, index) => (
        <li key={row.place} className={index === 0 ? "payout-row is-top" : "payout-row"}>
          <span className="payout-place">{formatPlace(row.place)}</span>
          <span className="payout-leader" aria-hidden="true" />
          <span className="payout-percent">{formatPercent(row.percentage)}</span>
          <span className="payout-value">{formatCurrency(row.payout)}</span>
          <span className="payout-bar">
            <span
              className="payout-fill"
              style={{ width: `${topPayout === 0 ? 0 : (row.payout / topPayout) * 100}%` }}
            />
          </span>
        </li>
      ))}
    </ol>
  );
}

export default PayoutList;
