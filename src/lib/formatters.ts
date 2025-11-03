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

export function formatDateTime(
  value: string | Date | null | undefined,
  locale = "vi-VN",
) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString(locale, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/**
 * Format date with custom options
 * @param value - Date value to format
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Locale string (default: "vi-VN")
 * @returns Formatted date string or "-" if invalid
 */
export function formatDateWithOptions(
  value: string | Date | null | undefined,
  options: Intl.DateTimeFormatOptions,
  locale = "vi-VN",
) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString(locale, options);
}

/**
 * Format date only (no time)
 * @param value - Date value to format
 * @param locale - Locale string (default: "vi-VN")
 * @returns Formatted date string or "-" if invalid
 */
export function formatDate(
  value: string | Date | null | undefined,
  locale = "vi-VN",
) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString(locale);
}
