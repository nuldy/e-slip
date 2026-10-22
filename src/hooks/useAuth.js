import { useContext } from "react"
import { AuthContext } from "@/context/authContext"

/**
 * Akses sesi login: { status, user, login, logout }.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider")
  }
  return context
}
