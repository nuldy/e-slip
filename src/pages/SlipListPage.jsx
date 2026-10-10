import { PageHeader } from "@/components/layout/PageHeader"
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

/**
 * Formats a number as Indonesian Rupiah currency string.
 * @param {number} amount
 * @returns {string} Formatted string, e.g. "Rp 70.000"
 */
function formatRupiah(amount) {
  return `Rp ${amount.toLocaleString("id-ID")}`
}

/**
 * Returns the appropriate Badge variant className based on slip status.
 * @param {string} status
 * @returns {string} Tailwind className for the Badge
 */
function getStatusBadgeClass(status) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-700 border-emerald-200"
    case "EXPIRED":
      return "bg-gray-100 text-gray-600 border-gray-200"
    case "UNPAID":
      return "bg-amber-100 text-amber-700 border-amber-200"
    default:
      return ""
  }
}

/**
 * Slip list page component.
 * Displays e-slips in a Table layout (adapted from mobile card view).
 *
 * @param {object} props
 * @param {object} props.user - Current user info { salesId, outletId }
 * @param {Array} props.slips - Array of slip objects
 * @param {function} props.onCreateSlip - Navigate to create slip form
 * @param {function} props.onLogout - Handle logout action
 */
function SlipListPage({ user, slips, onCreateSlip, onLogout }) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="E-SLIP"
        subtitle={`Outlet ${user.outletId} · Sales ${user.salesId}`}
      />

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4">
          <Button onClick={onCreateSlip} className="w-full sm:w-auto">
            + Buat E-SLIP
          </Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Slip</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slips.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Belum ada e-slip. Klik &quot;+ Buat E-SLIP&quot; untuk
                    membuat yang pertama.
                  </TableCell>
                </TableRow>
              ) : (
                slips.map((slip) => (
                  <TableRow key={slip.id}>
                    <TableCell className="font-medium">{slip.id}</TableCell>
                    <TableCell>{slip.customer}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatRupiah(slip.total)}
                    </TableCell>
                    <TableCell className="text-center">
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

        <div className="mt-4">
          <Button variant="link" onClick={onLogout} className="text-destructive px-0">
            Keluar
          </Button>
        </div>
      </div>
    </div>
  )
}

export { SlipListPage }

