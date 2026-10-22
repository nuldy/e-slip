import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { LoadingState } from "@/components/common/LoadingState"

/**
 * Melindungi route yang membutuhkan login. Saat sesi masih dipulihkan, tampilkan loading;
 * bila belum login, arahkan ke /login dan ingat halaman tujuan.
 */
export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === "loading") {
    return <LoadingState label="Memulihkan sesi..." className="min-h-screen" />
  }

  if (status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
