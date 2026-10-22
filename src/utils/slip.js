/**
 * Utilities and helpers for E-Slip domain logic.
 */

// Status E-Slip sesuai backend (e_slips.status)
export const SLIP_STATUSES = ["Open", "Locked", "Paid", "Expired", "Cancelled"]

// Status yang masih bisa diproses kasir POS; Locked tetap aktif agar kasir bisa scan ulang
const BARCODE_ACTIVE_STATUSES = ["Open", "Locked"]

const STATUS_BADGE_CLASSES = {
  Open: "bg-amber-100 text-amber-700 border-amber-200",
  Locked: "bg-sky-100 text-sky-700 border-sky-200",
  Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Expired: "bg-gray-100 text-gray-600 border-gray-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
}

/**
 * Returns the appropriate styling classes for status badges.
 * @param {string} status - Slip status (Open, Locked, Paid, Expired, Cancelled)
 * @returns {string} Tailwind CSS classes
 */
export function getStatusBadgeClass(status) {
  return STATUS_BADGE_CLASSES[status] || ""
}

/**
 * Whether the slip barcode can still be scanned at the POS.
 * @param {string} status - Slip status (Open, Locked, Paid, Expired, Cancelled)
 * @returns {boolean}
 */
export function isBarcodeActive(status) {
  return BARCODE_ACTIVE_STATUSES.includes(status)
}
