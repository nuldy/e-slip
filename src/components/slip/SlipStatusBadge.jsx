import { Badge } from "@/components/ui/badge"
import { getStatusBadgeClass } from "@/utils/slip"

export function SlipStatusBadge({ status }) {
  return (
    <Badge variant="outline" className={getStatusBadgeClass(status)}>
      {status}
    </Badge>
  )
}
