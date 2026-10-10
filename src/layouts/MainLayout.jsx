import { Navbar } from "@/components/layout/Navbar"

/**
 * Main application layout for authenticated pages.
 * Integrates the top navigation bar and centers content within a standard container.
 *
 * @param {object} props
 * @param {object} props.user - Logged in user info { salesId, outletId }
 * @param {string} props.currentPage - Active page identifier
 * @param {function} props.onNavigate - Page navigation callback
 * @param {function} props.onLogout - Logout callback
 * @param {React.ReactNode} props.children - Page content
 */
export function MainLayout({
  user,
  currentPage,
  onNavigate,
  onLogout,
  children,
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  )
}

