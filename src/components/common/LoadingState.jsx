import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoadingState({ label = "Memuat...", className = "py-16" }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 text-muted-foreground", className)}>
      <Loader2 className="size-6 animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
