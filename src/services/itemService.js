/**
 * Layanan katalog item untuk form E-Slip.
 */
import { apiRequest } from "@/services/apiClient"

/**
 * @param {object} params
 * @param {string} [params.search] - Kata kunci SKU atau nama produk
 * @returns {Promise<{ items: { sku: string, item_name: string, original_price: number, discount_price: number | null, effective_price: number }[] }>}
 */
export function getCatalogItems({ search } = {}) {
  return apiRequest("/items", { query: { search } })
}
