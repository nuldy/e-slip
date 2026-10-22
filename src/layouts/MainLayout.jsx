import { Outlet } from "react-router"
import { Navbar } from "@/components/layout/Navbar"

export function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
