import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router"
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
import { useAuth } from "@/hooks/useAuth"

export function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || "/slips"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (status === "authenticated") {
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await login(username, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || "Login gagal")
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <div className="mb-3 flex size-16 items-center justify-center rounded-2xl border bg-card p-3 shadow-sm ring-1 ring-foreground/5">
          <img
            src="/transmartlogo.png"
            alt="Transmart"
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

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Masuk</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="mt-2 w-full cursor-pointer">
              {submitting ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
