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

export function getStatusBadgeClass(status) {
  return STATUS_BADGE_CLASSES[status] || ""
}

export function isBarcodeActive(status) {
  return BARCODE_ACTIVE_STATUSES.includes(status)
}

// Pengganti barcode saat slip sudah tidak bisa diproses kasir
const INACTIVE_BARCODE_MESSAGES = {
  Paid: "E-Slip sudah dibayar. Barcode tidak ditampilkan lagi.",
  Cancelled: "E-Slip dibatalkan. Barcode tidak dapat digunakan di kasir.",
  Expired: "E-Slip sudah kedaluwarsa. Barcode tidak dapat discan di kasir.",
}

export function getInactiveBarcodeMessage(status) {
  return INACTIVE_BARCODE_MESSAGES[status] || "Slip sudah tidak berlaku, barcode tidak dapat discan di kasir."
}
