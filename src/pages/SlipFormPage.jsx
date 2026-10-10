import { useState } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

/**
 * Generates a unique slip ID based on current timestamp.
 * Format mirrors the pattern seen in the mobile app: long numeric string.
 * @returns {string} Generated slip ID
 */
function generateSlipId() {
  const now = new Date()
  const pad = (n, len = 2) => String(n).padStart(len, "0")
  return (
    "1001" +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    pad(now.getMilliseconds(), 3)
  )
}

/**
 * Slip creation form page.
 * Collects customer details, address, SPO flag, and item search.
 *
 * @param {object} props
 * @param {function} props.onSave - Callback with new slip data
 * @param {function} props.onCancel - Navigate back without saving
 */
function SlipFormPage({ onSave, onCancel }) {
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
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Buat E-SLIP"
        subtitle="Item dan stok dari ERP (contoh)"
      />

      <div className="mx-auto mt-6 max-w-lg px-4">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

              <div className="flex items-center gap-2">
                <Checkbox
                  id="hasSpo"
                  checked={hasSpo}
                  onCheckedChange={(checked) => setHasSpo(checked === true)}
                />
                <Label htmlFor="hasSpo" className="font-semibold">
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

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Total estimasi</span>
                <span className="text-sm font-bold">Rp 0</span>
              </div>

              <Button type="submit" className="w-full">
                Simpan E-SLIP
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={onCancel}
              >
                Batal
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { SlipFormPage }

