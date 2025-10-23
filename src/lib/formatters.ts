export function formatCurrencyVND(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

export function formatNumber(
  value: number | null | undefined,
  fractionDigits = 0,
) {
  if (value == null || Number.isNaN(value)) return "0";
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatShortCurrency(value: number | null | undefined) {
  // Returns number with separator and currency sign without currency formatting
  if (value == null || Number.isNaN(value)) return "0 ₫";
  return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
}
