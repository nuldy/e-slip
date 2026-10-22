import { useCallback, useEffect, useMemo, useState } from "react"
import { AuthContext } from "@/context/authContext"
import * as authService from "@/services/authService"
import { setUnauthorizedHandler } from "@/services/apiClient"

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => ({
    status: authService.hasSession() ? "loading" : "anonymous",
    user: null,
  }))

  const logout = useCallback(() => {
    authService.logout()
    setSession({ status: "anonymous", user: null })
  }, [])

  const login = useCallback(async (username, password) => {
    const user = await authService.login(username, password)
    setSession({ status: "authenticated", user })
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  useEffect(() => {
    if (!authService.hasSession()) return

    let active = true
    authService
      .getProfile()
      .then((user) => {
        if (active) setSession({ status: "authenticated", user })
      })
      .catch(() => {
        // 401 sudah ditangani unauthorized handler; error lain (mis. server mati) → minta login ulang
        if (active) setSession({ status: "anonymous", user: null })
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => ({ ...session, login, logout }), [session, login, logout])

  return <AuthContext value={value}>{children}</AuthContext>
}
