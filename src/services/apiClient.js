/**
 * HTTP client untuk API backend E-Slip.
 * Semua respons backend memakai amplop { success, code, message, data }.
 */
import { getToken } from "@/services/tokenStorage"

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/eslip/v1"

let unauthorizedHandler = null

/**
 * Error dari API, membawa status HTTP dan kode error backend (mis. VALIDATION_ERROR, NOT_FOUND).
 */
export class ApiError extends Error {
  constructor(message, { status, code, cause } = {}) {
    super(message, { cause })
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

/**
 * Mendaftarkan handler yang dipanggil saat request ber-auth ditolak 401 (token tidak valid/kedaluwarsa).
 * @param {(() => void) | null} handler
 */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

function buildUrl(path, query) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query || {})) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value)
    }
  }
  const queryString = params.toString()
  return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ""}`
}

/**
 * Mengirim request ke backend dan mengembalikan field `data` dari amplop respons.
 *
 * @param {string} path - Path relatif terhadap base URL, mis. "/slips"
 * @param {object} [options]
 * @param {string} [options.method]
 * @param {object} [options.body] - Dikirim sebagai JSON
 * @param {object} [options.query] - Query string; nilai kosong diabaikan
 * @param {boolean} [options.auth] - Sertakan token Bearer (default true)
 * @returns {Promise<any>}
 * @throws {ApiError}
 */
export async function apiRequest(path, { method = "GET", body, query, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers["Content-Type"] = "application/json"

  const token = auth ? getToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    throw new ApiError(
      "Gagal terhubung ke server backend. Pastikan server backend sedang berjalan.",
      { code: "NETWORK_ERROR", cause: error }
    )
  }

  const result = await response.json().catch(() => null)

  if (!response.ok || !result?.success) {
    if (response.status === 401 && auth && unauthorizedHandler) {
      unauthorizedHandler()
    }
    throw new ApiError(result?.message || `Request gagal (${response.status})`, {
      status: response.status,
      code: result?.code,
    })
  }

  return result.data
}
