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

