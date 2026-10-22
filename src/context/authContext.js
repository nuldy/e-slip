import { createContext } from "react"

// status: 'loading' (memulihkan sesi) | 'authenticated' | 'anonymous'
export const AuthContext = createContext(null)
