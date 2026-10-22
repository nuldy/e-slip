import { apiRequest } from "@/services/apiClient"

export function getSlips({ page, limit, status, search } = {}) {
  return apiRequest("/slips", { query: { page, limit, status, search } })
}

export function getSlipDetail(slipNumber) {
  return apiRequest(`/slips/${encodeURIComponent(slipNumber)}`)
}

export function createSlip(payload) {
  return apiRequest("/slips", { method: "POST", body: payload })
}
