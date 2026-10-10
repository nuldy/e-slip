import { useState } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
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
 * Login page component.
 * Renders a centered Card with ID sales and Password fields.
 *
 * @param {object} props
 * @param {function} props.onLogin - Callback with { salesId, password } on form submit
 */
function LoginPage({ onLogin }) {
  const [salesId, setSalesId] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    onLogin({ salesId, password })
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="E-SLIP"
        subtitle="Pesan di lapangan, bayar di kasir"
      />

      <div className="mx-auto mt-10 max-w-md px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Masuk</CardTitle>
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

              <Button type="submit" className="mt-2 w-full">
                Masuk
              </Button>

              <p className="text-sm text-destructive">
                Prototype: sales01 / admin123. Outlet mengikuti akun sales
                (10011).
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { LoginPage }

