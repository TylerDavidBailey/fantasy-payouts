const wholeCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const centsCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  // Show cents only for fractional amounts, always as two digits ("$33.30",
  // never "$33.3"). Rounding to cents first also normalizes FP noise.
  const cents = Math.round(value * 100);

  return cents % 100 === 0
    ? wholeCurrencyFormatter.format(cents / 100)
    : centsCurrencyFormatter.format(cents / 100);
}

export function formatPercent(value: number): string {
  // Shares below 0.05% would round to a misleading "0.0%".
  if (value > 0 && value < 0.0005) {
    return "<0.1%";
  }

  return `${(value * 100).toFixed(1)}%`;
}

export function formatPlace(place: number): string {
  if (place % 10 === 1 && place % 100 !== 11) {
    return `${place}st`;
  }

  if (place % 10 === 2 && place % 100 !== 12) {
    return `${place}nd`;
  }

  if (place % 10 === 3 && place % 100 !== 13) {
    return `${place}rd`;
  }

  return `${place}th`;
}
