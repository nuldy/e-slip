/**
 * Layanan E-Slip: daftar, detail, dan pembuatan slip.
 */
import { apiRequest } from "@/services/apiClient"

/**
 * @param {object} params
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {string} [params.status] - Open | Locked | Paid | Expired | Cancelled
 * @param {string} [params.search] - No. slip, nama, atau no HP customer
 * @returns {Promise<{ slips: object[], pagination: { total_records: number, page: number, limit: number, total_pages: number } }>}
 */
export function getSlips({ page, limit, status, search } = {}) {
  return apiRequest("/slips", { query: { page, limit, status, search } })
}

/**
 * @param {string} slipNumber - Nomor slip (atau ID)
 * @returns {Promise<object>} Detail slip beserta items dan status_logs
 */
export function getSlipDetail(slipNumber) {
  return apiRequest(`/slips/${encodeURIComponent(slipNumber)}`)
}

/**
 * @param {object} payload
 * @param {string} payload.customer_name
 * @param {string} [payload.customer_phone]
 * @param {string} [payload.shipping_address]
 * @param {boolean} payload.is_spo
 * @param {string} [payload.spo_number]
 * @param {{ sku: string, item_name: string, quantity: number, original_price: number, discount_price: number | null }[]} payload.items
 * @returns {Promise<object>} Slip yang baru dibuat
 */
export function createSlip(payload) {
  return apiRequest("/slips", { method: "POST", body: payload })
}
