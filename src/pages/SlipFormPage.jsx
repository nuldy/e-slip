import { useState } from "react"
import { MainLayout } from "@/layouts/MainLayout"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { generateSlipId } from "@/utils/slip"

/**
 * Slip creation form page component.
 * Displays breadcrumb navigation and collects customer details.
 *
 * @param {object} props
 * @param {object} props.user - Logged in user info
 * @param {function} props.onSave - Callback with new slip data
 * @param {function} props.onNavigate - Page navigation callback
 * @param {function} props.onLogout - Logout callback
 */
export function SlipFormPage({ user, onSave, onNavigate, onLogout }) {
  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [hasSpo, setHasSpo] = useState(false)
  const [item, setItem] = useState("")

  function handleSubmit(e) {
    e.preventDefault()

    const newSlip = {
      id: generateSlipId(),
      customer: customerName,
      phone: phoneNumber,
      address,
      hasSpo,
      item,
      total: 0,
      status: "UNPAID",
    }

    onSave(newSlip)
  }

  return (
    <MainLayout
      user={user}
      currentPage="form"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Shadcn UI Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => onNavigate("list")}
                className="hover:text-foreground cursor-pointer"
              >
                Daftar E-Slip
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Buat E-Slip</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Form Card */}
        <Card className="shadow-xs">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Buat E-SLIP</CardTitle>
            <CardDescription>
              Item dan stok dari ERP (contoh)
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="customerName">Nama customer</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Nama"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phoneNumber">No HP</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address">Alamat kirim</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Alamat lengkap"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2.5 py-1">
                <Checkbox
                  id="hasSpo"
                  checked={hasSpo}
                  onCheckedChange={(checked) => setHasSpo(checked === true)}
                />
                <Label htmlFor="hasSpo" className="font-semibold cursor-pointer">
                  Ada SPO
                </Label>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="item" className="font-semibold">
                  Item
                </Label>
                <Input
                  id="item"
                  type="text"
                  placeholder="Cari kode atau nama item (ERP)"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3.5">
                <span className="text-sm font-medium text-muted-foreground">
                  Total estimasi
                </span>
                <span className="text-base font-bold text-foreground">
                  Rp 0
                </span>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <Button type="submit" className="w-full cursor-pointer">
                  Simpan E-SLIP
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  onClick={() => onNavigate("list")}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
