import { createContext } from "react"

/**
 * Context sesi login: { status, user, login, logout }.
 * status: 'loading' (memulihkan sesi) | 'authenticated' | 'anonymous'
 */
export const AuthContext = createContext(null)
