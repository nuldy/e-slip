/**
 * Utilities and helpers for E-Slip domain logic.
 */

/**
 * Generates a unique slip ID based on the current timestamp.
 * Follows the pattern: 1001 + MM + DD + HH + mm + ss + SSS
 * @returns {string} Generated slip ID
 */
export function generateSlipId() {
  const now = new Date()
  const pad = (n, len = 2) => String(n).padStart(len, "0")
  return (
    "1001" +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    pad(now.getMilliseconds(), 3)
  )
}

/**
 * Returns the appropriate styling classes for status badges.
 * @param {string} status - Slip status (PAID, EXPIRED, UNPAID)
 * @returns {string} Tailwind CSS classes
 */
export function getStatusBadgeClass(status) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "EXPIRED":
      return "bg-gray-100 text-gray-600 border-gray-200"
    case "UNPAID":
      return "bg-amber-100 text-amber-700 border-amber-200"
    default:
      return ""
  }
}

