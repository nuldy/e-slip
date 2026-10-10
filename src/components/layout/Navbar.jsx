import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, PlusCircle, LogOut, Store, User } from "lucide-react"

/**
 * Navigation Bar component for desktop web application.
 * Provides brand identity, page navigation, user session info, and logout action.
 *
 * @param {object} props
 * @param {object} props.user - User info containing salesId and outletId
 * @param {string} props.currentPage - Current active page ('list' | 'form')
 * @param {function} props.onNavigate - Callback function to change pages
 * @param {function} props.onLogout - Callback function to log out
 */
export function Navbar({ user, currentPage, onNavigate, onLogout }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <div
            onClick={() => onNavigate("list")}
            className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-xs">
              <FileText className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-foreground">
                  E-SLIP
                </span>
                {user?.outletId && (
                  <Badge variant="secondary" className="gap-1 font-normal text-xs">
                    <Store className="size-3" />
                    Outlet {user.outletId}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5">
            <Button
              variant={currentPage === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate("list")}
              className="gap-2 cursor-pointer"
            >
              <FileText className="size-4" />
              Daftar E-Slip
            </Button>

            <Button
              variant={currentPage === "form" ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate("form")}
              className="gap-2 cursor-pointer"
            >
              <PlusCircle className="size-4" />
              Buat E-Slip
            </Button>
          </nav>
        </div>

        {/* Right: User Session & Logout */}
        <div className="flex items-center gap-3">
          {user?.salesId && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
              <User className="size-3.5 text-foreground" />
              <span>Sales:</span>
              <span className="font-semibold text-foreground">{user.salesId}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer gap-1.5"
          >
            <LogOut className="size-4" />
            <span>Keluar</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

