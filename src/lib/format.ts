const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
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
