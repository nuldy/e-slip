import { Navigate, Route, Routes } from "react-router"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { MainLayout } from "@/layouts/MainLayout"
import { LoginPage } from "@/pages/LoginPage"
import { SlipListPage } from "@/pages/SlipListPage"
import { SlipFormPage } from "@/pages/SlipFormPage"
import { SlipDetailPage } from "@/pages/SlipDetailPage"

/**
 * Definisi route aplikasi. Semua halaman E-Slip membutuhkan login.
 */
export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/slips" element={<SlipListPage />} />
          <Route path="/slips/new" element={<SlipFormPage />} />
          <Route path="/slips/:slipNumber" element={<SlipDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/slips" replace />} />
    </Routes>
  )
}
