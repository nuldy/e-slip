/**
 * Layanan autentikasi: login, profil sesi, dan logout.
 */
import { apiRequest } from "@/services/apiClient"
import { clearToken, getToken, setToken } from "@/services/tokenStorage"

/**
 * Login dengan username dan password; token sesi disimpan bila berhasil.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object>} Data user dari backend
 */
export async function login(username, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: { username, password },
    auth: false,
  })
  setToken(data.token)
  return data.user
}

/**
 * Mengambil profil user dari token yang tersimpan (untuk memulihkan sesi).
 * @returns {Promise<object>}
 */
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
