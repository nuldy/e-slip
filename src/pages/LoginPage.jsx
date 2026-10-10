import { useState } from "react"
import { AuthLayout } from "@/layouts/AuthLayout"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/**
 * Login page component wrapped in AuthLayout.
 * Displays a logo placeholder and title above the login card.
 *
 * @param {object} props
 * @param {function} props.onLogin - Callback with { salesId, password } on form submit
 */
export function LoginPage({ onLogin }) {
  const [salesId, setSalesId] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    onLogin({ salesId, password })
  }

  return (
    <AuthLayout>
      {/* Logo Placeholder & E-Slip Title directly above the Card */}
      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <div className="mb-3 flex size-16 items-center justify-center rounded-2xl border bg-card p-3 shadow-sm ring-1 ring-foreground/5">
          <img
            src="/transmartlogo.png"
            className="size-10 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          E-Slip
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pesan di lapangan, bayar di kasir
        </p>
      </div>

      {/* Login Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Masuk</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="salesId">ID sales</Label>
              <Input
                id="salesId"
                type="text"
                placeholder="ID sales"
                value={salesId}
                onChange={(e) => setSalesId(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="mt-2 w-full cursor-pointer">
              Masuk
            </Button>

            <p className="text-xs text-muted-foreground bg-muted/60 p-2.5 rounded-md border text-center">
              <span className="font-semibold text-foreground">Prototype:</span>{" "}
              sales01 / admin123. Outlet mengikuti akun sales (10011).
            </p>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
