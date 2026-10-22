import { Link, NavLink } from "react-router"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { FileText, LogOut, Store, User } from "lucide-react"

function navLinkClass({ isActive }) {
  return cn(buttonVariants({ variant: isActive ? "default" : "ghost", size: "sm" }), "gap-2")
}

/**
 * Navigation Bar component for desktop web application.
 * Provides brand identity, page navigation, user session info, and logout action.
 */
export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/slips" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-xs">
              <FileText className="size-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-foreground">E-SLIP</span>
              {user?.store_code && (
                <Badge variant="secondary" className="gap-1 font-normal text-xs">
                  <Store className="size-3" />
                  {user.store_code}
                </Badge>
              )}
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5">
            <NavLink to="/slips" end className={navLinkClass}>
              Daftar E-Slip
            </NavLink>
            <NavLink to="/slips/new" className={navLinkClass}>
              Buat E-Slip
            </NavLink>
          </nav>
        </div>

        {/* Right: User Session & Logout */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
              <User className="size-3.5 text-foreground" />
              <span className="font-semibold text-foreground">{user.name || user.username}</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
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
