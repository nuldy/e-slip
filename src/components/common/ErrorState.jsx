import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Pesan error dengan tombol "Coba lagi" opsional.
 *
 * @param {object} props
 * @param {string} props.message
 * @param {() => void} [props.onRetry]
 * @param {React.ReactNode} [props.children] - Aksi tambahan
 */
export function ErrorState({ message, onRetry, children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <AlertCircle className="size-8 text-destructive" />
      <p className="max-w-md text-sm text-foreground">{message}</p>
      <div className="flex gap-2">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="cursor-pointer">
            Coba lagi
          </Button>
        )}
        {children}
      </div>
    </div>
  )
}
