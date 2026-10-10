import { MainLayout } from "@/layouts/MainLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { formatRupiah } from "@/utils/formatters"
import { getStatusBadgeClass } from "@/utils/slip"
import { Plus, ReceiptText } from "lucide-react"

/**
 * Slip list page component.
 * Displays a header card and an enlarged table listing e-slips.
 *
 * @param {object} props
 * @param {object} props.user - Current user info { salesId, outletId }
 * @param {Array} props.slips - Array of slip objects
 * @param {function} props.onNavigate - Page navigation callback
 * @param {function} props.onLogout - Logout callback
 */
export function SlipListPage({ user, slips, onNavigate, onLogout }) {
  return (
    <MainLayout
      user={user}
      currentPage="list"
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      <div className="w-full space-y-6">
        {/* Header Card matching table width */}
        <Card className="w-full shadow-xs py-2">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ReceiptText className="size-5 text-brand" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Daftar E-Slip
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Kelola dan pantau seluruh transaksi e-slip untuk outlet {user?.outletId || "10011"}
              </p>
            </div>

            <Button
              onClick={() => onNavigate("form")}
              className="gap-2 cursor-pointer w-full sm:w-auto font-medium"
            >
              <Plus className="size-4" />
              Buat E-Slip
            </Button>
          </div>
        </Card>

        {/* Enlarged Table with Distinct Header Row Styling */}
        <div className="w-full overflow-hidden rounded-xl border bg-card shadow-xs">
          <Table className="w-full">
            <TableHeader className="bg-muted/70 border-b">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  No. Slip
                </TableHead>
                <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer
                </TableHead>
                <TableHead className="py-4 px-6 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Estimasi
                </TableHead>
                <TableHead className="py-4 px-6 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {slips.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ReceiptText className="size-8 text-muted-foreground/40" />
                      <p className="font-medium text-base">Belum ada e-slip</p>
                      <p className="text-sm text-muted-foreground">
                        Klik tombol &quot;Buat E-Slip&quot; untuk membuat pesanan baru.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                slips.map((slip) => (
                  <TableRow
                    key={slip.id}
                    className="hover:bg-muted/30 transition-colors border-b last:border-b-0"
                  >
                    <TableCell className="py-4 px-6 font-semibold text-foreground">
                      {slip.id}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-foreground/90 font-medium">
                      {slip.customer}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right font-bold text-foreground">
                      {formatRupiah(slip.total)}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <Badge
                        variant="outline"
                        className={getStatusBadgeClass(slip.status)}
                      >
                        {slip.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  )
}
