import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { LoadingState } from "@/components/common/LoadingState"
import { ErrorState } from "@/components/common/ErrorState"
import { SlipBarcode } from "@/components/slip/SlipBarcode"
import { SlipStatusBadge } from "@/components/slip/SlipStatusBadge"
import { getSlipDetail } from "@/services/slipService"
import { formatDateTime, formatRupiah } from "@/utils/formatters"
import { isBarcodeActive } from "@/utils/slip"

const ERROR_MESSAGES = {
  404: "E-Slip tidak ditemukan.",
  403: "E-Slip ini milik toko lain dan tidak dapat dibuka.",
}

function InfoField({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{children || "-"}</span>
    </div>
  )
}

export function SlipDetailPage() {
  const { slipNumber } = useParams()
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ key: null, slip: null, error: null })

  const requestKey = `${slipNumber}|${reloadCount}`
  const loading = result.key !== requestKey

  useEffect(() => {
    let active = true
    getSlipDetail(slipNumber)
      .then((slip) => {
        if (active) setResult({ key: requestKey, slip, error: null })
      })
      .catch((error) => {
        if (active) setResult({ key: requestKey, slip: null, error })
      })
    return () => {
      active = false
    }
  }, [requestKey, slipNumber])

  const { slip, error } = result

  return (
    <div className="w-full space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/slips">Daftar E-Slip</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-mono">{slipNumber}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {loading ? (
        <LoadingState label="Memuat detail e-slip..." />
      ) : error ? (
        <ErrorState
          message={ERROR_MESSAGES[error.status] || error.message}
          onRetry={ERROR_MESSAGES[error.status] ? undefined : () => setReloadCount((n) => n + 1)}
        >
          <Link to="/slips" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Kembali ke daftar
          </Link>
        </ErrorState>
      ) : (
        <>
          <Card className="shadow-xs">
            <CardContent className="flex flex-col items-center gap-2 text-center">
              {isBarcodeActive(slip.status) ? (
                <SlipBarcode value={slip.barcode} />
              ) : (
                <>
                  <p className="font-mono text-xl font-bold tracking-wider text-foreground sm:text-3xl">
                    {slip.slip_number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Slip sudah tidak berlaku, barcode tidak dapat discan di kasir.
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <SlipStatusBadge status={slip.status} />
                  <span>Berlaku sampai {formatDateTime(slip.expired_at)}</span>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Estimasi
                </span>
                <p className="text-2xl font-bold text-foreground">{formatRupiah(slip.total_estimated)}</p>
                <p className="text-sm text-muted-foreground">
                  {slip.total_items} item · {slip.total_quantity} pcs
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Informasi Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Nama customer">{slip.customer_name}</InfoField>
              <InfoField label="No HP">{slip.customer_phone}</InfoField>
              <InfoField label="Alamat kirim">{slip.shipping_address}</InfoField>
              <InfoField label="SPO">{slip.is_spo ? `Ya · ${slip.spo_number}` : "Tidak"}</InfoField>
              <InfoField label="Dibuat oleh">{slip.created_by}</InfoField>
              <InfoField label="Dibuat pada">{formatDateTime(slip.created_at)}</InfoField>
            </CardContent>
          </Card>

          <div className="w-full overflow-hidden rounded-xl border bg-card shadow-xs">
            <Table className="w-full">
              <TableHeader className="bg-muted/70 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-6">SKU</TableHead>
                  <TableHead className="px-6">Nama Produk</TableHead>
                  <TableHead className="px-6 text-right">Qty</TableHead>
                  <TableHead className="px-6 text-right">Harga</TableHead>
                  <TableHead className="px-6 text-right">Harga Diskon</TableHead>
                  <TableHead className="px-6 text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slip.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-6 font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="px-6">{item.item_name}</TableCell>
                    <TableCell className="px-6 text-right">{item.quantity}</TableCell>
                    <TableCell className="px-6 text-right">{formatRupiah(item.original_price)}</TableCell>
                    <TableCell className="px-6 text-right">
                      {item.discount_price !== null ? formatRupiah(item.discount_price) : "-"}
                    </TableCell>
                    <TableCell className="px-6 text-right font-semibold">{formatRupiah(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="px-6 text-right font-semibold">
                    Total Estimasi
                  </TableCell>
                  <TableCell className="px-6 text-right font-bold">{formatRupiah(slip.total_estimated)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          <Card className="shadow-xs">
            <CardHeader>
              <CardTitle className="text-base font-bold">Riwayat Status</CardTitle>
            </CardHeader>
            <CardContent>
              {slip.status_logs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada riwayat status.</p>
              ) : (
                <ol className="space-y-4 border-l pl-5">
                  {slip.status_logs.map((log) => (
                    <li key={log.id} className="relative">
                      <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full bg-brand" />
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {log.previous_status && (
                          <>
                            <span className="text-muted-foreground">{log.previous_status}</span>
                            <span className="text-muted-foreground">→</span>
                          </>
                        )}
                        <SlipStatusBadge status={log.new_status} />
                        <span className="text-muted-foreground">{formatDateTime(log.created_at)}</span>
                      </div>
                      <p className="mt-1 text-sm text-foreground">
                        {log.notes || "-"}{" "}
                        <span className="text-muted-foreground">
                          · oleh {log.changed_by} ({log.change_source})
                        </span>
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
