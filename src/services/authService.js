import { apiRequest } from "@/services/apiClient"
import { clearToken, getToken, setToken } from "@/services/tokenStorage"

export async function login(username, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: { username, password },
    auth: false,
  })
  setToken(data.token)
  return data.user
}

export async function getProfile() {
  const data = await apiRequest("/auth/me")
  return data.user
}

export function hasSession() {
  return Boolean(getToken())
}

export function logout() {
  clearToken()
}
