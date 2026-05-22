export const formatCurrency = (amount: number) => {
  const rounded = Math.round(amount || 0);
  return `₹${rounded.toLocaleString('en-IN')}`;
};

export const parseCurrencyInput = (value: string) => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};
