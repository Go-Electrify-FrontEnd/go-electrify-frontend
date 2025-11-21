import { formatDistanceToNow } from "date-fns";
import type { Locale } from "date-fns";
import { vi } from "date-fns/locale";

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

const FULL_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

export function formatFullDate(
  value: string | Date | null | undefined,
  locale = "vi-VN",
) {
  return formatDateWithOptions(value, FULL_DATE_TIME_OPTIONS, locale);
}

type RelativeTimeOptions = {
  addSuffix?: boolean;
  includeSeconds?: boolean;
  locale?: Locale;
  now?: Date | number;
  fallback?: string;
};

export function formatRelativeTime(
  value: string | Date | null | undefined,
  options?: RelativeTimeOptions,
) {
  const fallback = options?.fallback ?? "-";
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : fallback;
  }

  try {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: vi,
      ...options,
    });
  } catch {
    return fallback;
  }
}

/**
 * Format duration between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Formatted duration string (e.g., "2h 30m" or "45m")
 */
export function formatDuration(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined,
) {
  if (!start || !end) return "N/A";

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "N/A";
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}
