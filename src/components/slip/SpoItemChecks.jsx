import { Badge } from "@/components/ui/badge"
import { SPO_CHECK_STATUS, countSpoMismatches } from "@/utils/spo"

const MATCH_CLASS = "bg-emerald-100 text-emerald-700 border-emerald-200"
const MISMATCH_CLASS = "bg-red-100 text-red-700 border-red-200"

const CHECK_LABELS = {
  [SPO_CHECK_STATUS.MATCH]: "Sesuai",
  [SPO_CHECK_STATUS.MISSING]: "SKU belum ada di E-Slip",
  [SPO_CHECK_STATUS.INSUFFICIENT]: "Qty E-Slip kurang",
}

function CheckBadge({ matched, children }) {
  return (
    <Badge variant="outline" className={matched ? MATCH_CLASS : MISMATCH_CLASS}>
      {children}
    </Badge>
  )
}

export function SpoItemChecks({ spo, checks }) {
  const mismatchCount = countSpoMismatches(checks)

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-3 py-2.5 text-sm">
        <p>
          <span className="font-semibold text-foreground">SPO {spo.spo_number}</span>
          <span className="text-muted-foreground"> · {spo.total_items} item · {spo.total_quantity} pcs</span>
        </p>
        <CheckBadge matched={mismatchCount === 0}>
          {mismatchCount === 0 ? "Semua item sesuai" : `${mismatchCount} item belum sesuai`}
        </CheckBadge>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-muted/70 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-3 py-2.5">Item SPO</th>
            <th className="px-3 py-2.5 w-20 text-right">Qty SPO</th>
            <th className="px-3 py-2.5 w-24 text-right">Qty E-Slip</th>
            <th className="hidden px-3 py-2.5 w-48 sm:table-cell">Status</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => {
            const badge = (
              <CheckBadge matched={check.status === SPO_CHECK_STATUS.MATCH}>
                {CHECK_LABELS[check.status]}
              </CheckBadge>
            )
            return (
              <tr key={check.sku} className="border-t align-middle">
                <td className="px-3 py-2">
                  <p className="font-medium text-foreground">{check.item_name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{check.sku}</p>
                  <div className="mt-1.5 sm:hidden">{badge}</div>
                </td>
                <td className="px-3 py-2 text-right">{check.spo_quantity}</td>
                <td className="px-3 py-2 text-right">{check.slip_quantity}</td>
                <td className="hidden px-3 py-2 sm:table-cell">{badge}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <p className="border-t px-3 py-2 text-xs text-muted-foreground">
        Setiap item SPO wajib ada di E-Slip dengan qty minimal sama dengan qty SPO. Item di luar SPO boleh ditambahkan.
      </p>
    </div>
  )
}
