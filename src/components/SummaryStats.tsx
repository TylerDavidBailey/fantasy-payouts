import type { JSX } from "react";
import { formatCurrency, formatPercent } from "../lib/format";
import type { PayoutCalculationResult } from "../lib/payouts";

type SummaryStatsProps = {
  result: PayoutCalculationResult;
  entrants: number;
};

function SummaryStats({ result, entrants }: SummaryStatsProps): JSX.Element {
  const firstPrize = result.payouts[0]?.payout ?? 0;
  const minCash = result.payouts[result.payouts.length - 1]?.payout ?? 0;
  const fieldPaid = entrants === 0 ? 0 : result.payouts.length / entrants;

  return (
    <dl className="summary-stats">
      <div className="stat">
        <dt>Prize pool</dt>
        <dd>{formatCurrency(result.totalPool)}</dd>
      </div>
      <div className="stat">
        <dt>First prize</dt>
        <dd>{formatCurrency(firstPrize)}</dd>
      </div>
      <div className="stat">
        <dt>Min cash</dt>
        <dd>{formatCurrency(minCash)}</dd>
      </div>
      <div className="stat">
        <dt>Field paid</dt>
        <dd>{formatPercent(fieldPaid)}</dd>
      </div>
    </dl>
  );
}

export default SummaryStats;
