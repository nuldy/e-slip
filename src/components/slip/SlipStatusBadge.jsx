import { Badge } from "@/components/ui/badge"
import { getStatusBadgeClass, getStatusLabel } from "@/utils/slip"

/**
 * Status badge for an E-Slip.
 *
 * @param {object} props
 * @param {string} props.status - Open | Locked | Paid | Expired | Cancelled
 */
export function SlipStatusBadge({ status }) {
  return (
    <Badge variant="outline" className={getStatusBadgeClass(status)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
