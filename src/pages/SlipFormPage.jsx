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
import { createSlip } from "@/services/slipService"
import { formatRupiah } from "@/utils/formatters"
import { Plus, Trash2 } from "lucide-react"

function createEmptyItem() {
  return { key: crypto.randomUUID(), sku: "", item_name: "", quantity: "1", original_price: "", discount_price: "" }
}

// Perkiraan subtotal untuk tampilan; nilai final dihitung ulang oleh backend
function estimateSubtotal(item) {
  const price = item.discount_price !== "" ? Number(item.discount_price) : Number(item.original_price)
  const subtotal = Number(item.quantity) * price
  return Number.isFinite(subtotal) ? Math.round(subtotal * 100) / 100 : 0
}

const cellInputClass = "h-9 min-w-0"

/**
 * Slip creation form page component.
 * Collects customer details and item rows, then creates the slip via the backend
 * and opens its detail page.
 */
export function SlipFormPage() {
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [hasSpo, setHasSpo] = useState(false)
  const [spoNumber, setSpoNumber] = useState("")
  const [items, setItems] = useState(() => [createEmptyItem()])
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const totalEstimated = items.reduce((sum, item) => sum + estimateSubtotal(item), 0)

  function updateItem(key, field, value) {
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)))
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const created = await createSlip({
        customer_name: customerName.trim(),
        customer_phone: phoneNumber.trim(),
        shipping_address: address.trim(),
        is_spo: hasSpo,
        spo_number: hasSpo ? spoNumber.trim() : "",
        items: items.map((item) => ({
          sku: item.sku.trim(),
          item_name: item.item_name.trim(),
          quantity: Number(item.quantity),
          original_price: Number(item.original_price),
          discount_price: item.discount_price === "" ? null : Number(item.discount_price),
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
            Isi data customer dan item yang akan dibayar di kasir.
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

            {/* Item rows */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Item</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setItems((prev) => [...prev, createEmptyItem()])}
                  className="cursor-pointer gap-1"
                >
                  <Plus className="size-4" />
                  Tambah item
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-muted/70 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2.5 w-32">SKU</th>
                      <th className="px-3 py-2.5">Nama produk</th>
                      <th className="px-3 py-2.5 w-20">Qty</th>
                      <th className="px-3 py-2.5 w-32">Harga satuan</th>
                      <th className="px-3 py-2.5 w-32">Harga setelah diskon</th>
                      <th className="px-3 py-2.5 w-32 text-right">Subtotal</th>
                      <th className="px-3 py-2.5 w-12" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.key} className="border-t align-top">
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`SKU item ${index + 1}`}
                            placeholder="SKU"
                            maxLength={50}
                            value={item.sku}
                            onChange={(e) => updateItem(item.key, "sku", e.target.value)}
                            required
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Nama produk item ${index + 1}`}
                            placeholder="Nama produk"
                            maxLength={255}
                            value={item.item_name}
                            onChange={(e) => updateItem(item.key, "item_name", e.target.value)}
                            required
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Qty item ${index + 1}`}
                            type="number"
                            min={1}
                            step={1}
                            value={item.quantity}
                            onChange={(e) => updateItem(item.key, "quantity", e.target.value)}
                            required
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Harga satuan item ${index + 1}`}
                            type="number"
                            min={0}
                            step="any"
                            placeholder="0"
                            value={item.original_price}
                            onChange={(e) => updateItem(item.key, "original_price", e.target.value)}
                            required
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Harga setelah diskon item ${index + 1}`}
                            type="number"
                            min={0}
                            max={item.original_price || undefined}
                            step="any"
                            placeholder="Opsional"
                            value={item.discount_price}
                            onChange={(e) => updateItem(item.key, "discount_price", e.target.value)}
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-3 py-2 text-right font-medium leading-9">
                          {formatRupiah(estimateSubtotal(item))}
                        </td>
                        <td className="px-3 py-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Hapus item ${index + 1}`}
                            disabled={items.length === 1}
                            onClick={() => removeItem(item.key)}
                            className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
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
