/**
 * Utility functions for formatting values.
 */

/**
 * Formats a number as Indonesian Rupiah currency string.
 * @param {number} amount
 * @returns {string} Formatted string, e.g. "Rp 70.000"
 */
export function formatRupiah(amount) {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "Rp 0"
  }
  return `Rp ${amount.toLocaleString("id-ID")}`
}

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
})

/**
 * Formats an ISO date string as a local date and time, e.g. "22 Okt 2026, 10.00".
 * @param {string | null | undefined} value
 * @returns {string} Formatted string, or "-" when empty/invalid
 */
export function formatDateTime(value) {
  if (!value) return "-"
  const date = new Date(value)
  return isNaN(date.getTime()) ? "-" : dateTimeFormatter.format(date)
}

