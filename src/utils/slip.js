/**
 * Utilities and helpers for E-Slip domain logic.
 */

// Status E-Slip sesuai backend (e_slips.status)
export const SLIP_STATUSES = ["Open", "Locked", "Paid", "Expired", "Cancelled"]

const STATUS_LABELS = {
  Open: "Menunggu Bayar",
  Locked: "Diproses Kasir",
  Paid: "Lunas",
  Expired: "Kedaluwarsa",
  Cancelled: "Dibatalkan",
}

const STATUS_BADGE_CLASSES = {
  Open: "bg-amber-100 text-amber-700 border-amber-200",
  Locked: "bg-sky-100 text-sky-700 border-sky-200",
  Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Expired: "bg-gray-100 text-gray-600 border-gray-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
}

/**
 * Returns the Indonesian display label for a slip status.
 * @param {string} status
 * @returns {string}
 */
export function getStatusLabel(status) {
  return STATUS_LABELS[status] || status
}

/**
 * Returns the appropriate styling classes for status badges.
 * @param {string} status - Slip status (Open, Locked, Paid, Expired, Cancelled)
 * @returns {string} Tailwind CSS classes
 */
export function getStatusBadgeClass(status) {
  return STATUS_BADGE_CLASSES[status] || ""
}
