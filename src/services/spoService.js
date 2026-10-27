import { apiRequest } from "@/services/apiClient"

export function getSpo(spoNumber) {
  return apiRequest(`/spo/${encodeURIComponent(spoNumber)}`)
}
