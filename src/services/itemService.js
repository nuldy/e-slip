import { apiRequest } from "@/services/apiClient"

export function getCatalogItems({ search } = {}) {
  return apiRequest("/items", { query: { search } })
}
