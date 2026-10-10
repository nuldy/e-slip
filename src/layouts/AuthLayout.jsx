/**
 * Layout for unauthenticated / authentication pages.
 * Centers the login experience with a clean, distraction-free backdrop.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-slate-50/70 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {children}
      </div>
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        &copy; 2026 E-Slip System. All rights reserved.
      </footer>
    </div>
  )
}

