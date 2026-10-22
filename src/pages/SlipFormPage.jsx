import { useState } from "react"
import { Link, useNavigate } from "react-router"
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
import { ItemPicker } from "@/components/slip/ItemPicker"
import { createSlip } from "@/services/slipService"
import { formatRupiah } from "@/utils/formatters"
import { Trash2 } from "lucide-react"

// Perkiraan subtotal untuk tampilan; nilai final dihitung ulang oleh backend
function estimateSubtotal(item) {
  const subtotal = (Number(item.quantity) || 0) * item.effective_price
  return Math.round(subtotal * 100) / 100
}

/**
 * Slip creation form page component.
 * Collects customer details and items picked from the catalog dropdown, then creates
 * the slip via the backend and opens its detail page.
 */
export function SlipFormPage() {
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [hasSpo, setHasSpo] = useState(false)
  const [spoNumber, setSpoNumber] = useState("")
  const [items, setItems] = useState([])
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const totalEstimated = items.reduce((sum, item) => sum + estimateSubtotal(item), 0)
  const selectedQuantities = Object.fromEntries(items.map((item) => [item.sku, Number(item.quantity) || 0]))

  /** Adds a catalog item, or bumps its qty when it is already in the slip. */
  function addItem(catalogItem) {
    setItems((prev) => {
      const existing = prev.find((item) => item.sku === catalogItem.sku)
      if (existing) {
        return prev.map((item) =>
          item.sku === catalogItem.sku ? { ...item, quantity: String((Number(item.quantity) || 0) + 1) } : item
        )
      }
      return [...prev, { ...catalogItem, quantity: "1" }]
    })
  }

  function updateQuantity(sku, quantity) {
    setItems((prev) => prev.map((item) => (item.sku === sku ? { ...item, quantity } : item)))
  }

  function removeItem(sku) {
    setItems((prev) => prev.filter((item) => item.sku !== sku))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (items.length === 0) {
      setError("Tambahkan minimal 1 item dari daftar item.")
      return
    }

    setSubmitting(true)

    try {
      const created = await createSlip({
        customer_name: customerName.trim(),
        customer_phone: phoneNumber.trim(),
        shipping_address: address.trim(),
        is_spo: hasSpo,
        spo_number: hasSpo ? spoNumber.trim() : "",
        items: items.map((item) => ({
          sku: item.sku,
          item_name: item.item_name,
          quantity: Number(item.quantity),
          original_price: item.original_price,
          discount_price: item.discount_price,
        })),
      })
      navigate(`/slips/${created.slip_number}`, { replace: true })
    } catch (err) {
      setError(err.message || "Gagal membuat E-Slip")
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/slips">Daftar E-Slip</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Buat E-Slip</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Buat E-SLIP</CardTitle>
          <CardDescription>
            Isi data customer dan pilih item yang akan dibayar di kasir.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="customerName">Nama customer</Label>
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Nama"
                  maxLength={255}
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
                  maxLength={20}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
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

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

              {hasSpo && (
                <Input
                  id="spoNumber"
                  type="text"
                  aria-label="Nomor SPO"
                  placeholder="Nomor SPO"
                  maxLength={50}
                  value={spoNumber}
                  onChange={(e) => setSpoNumber(e.target.value)}
                  required
                  className="sm:max-w-xs"
                />
              )}
            </div>

            {/* Items: picked from the catalog dropdown; only qty is editable */}
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Item</Label>
              <ItemPicker onSelect={addItem} selectedQuantities={selectedQuantities} />

              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-muted/70 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2.5">Item</th>
                      <th className="px-3 py-2.5 w-36 text-right">Harga</th>
                      <th className="px-3 py-2.5 w-24">Qty</th>
                      <th className="px-3 py-2.5 w-36 text-right">Subtotal</th>
                      <th className="px-3 py-2.5 w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr className="border-t">
                        <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                          Belum ada item. Cari dan klik item pada daftar di atas.
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.sku} className="border-t align-middle">
                          <td className="px-3 py-2">
                            <p className="font-medium text-foreground">{item.item_name}</p>
                            <p className="font-mono text-xs text-muted-foreground">{item.sku}</p>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <p className="font-medium">{formatRupiah(item.effective_price)}</p>
                            {item.discount_price !== null && (
                              <p className="text-xs text-muted-foreground line-through">
                                {formatRupiah(item.original_price)}
                              </p>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              aria-label={`Qty ${item.item_name}`}
                              type="number"
                              min={1}
                              step={1}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.sku, e.target.value)}
                              required
                              className="h-9"
                            />
                          </td>
                          <td className="px-3 py-2 text-right font-semibold">
                            {formatRupiah(estimateSubtotal(item))}
                          </td>
                          <td className="px-3 py-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Hapus ${item.item_name}`}
                              onClick={() => removeItem(item.sku)}
                              className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3.5">
              <span className="text-sm font-medium text-muted-foreground">
                Total estimasi
              </span>
              <span className="text-base font-bold text-foreground">
                {formatRupiah(totalEstimated)}
              </span>
            </div>

            {error && (
              <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2.5 pt-2">
              <Button type="submit" disabled={submitting} className="w-full cursor-pointer">
                {submitting ? "Menyimpan..." : "Simpan E-SLIP"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                onClick={() => navigate("/slips")}
              >
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
