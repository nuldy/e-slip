import { Link } from "react-router"
import { CheckCircle2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatDateTime, formatRupiah } from "@/utils/formatters"

export function PaymentSuccessDialog({ slip, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center sm:max-w-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </div>

        <DialogHeader className="items-center">
          <DialogTitle>Pembayaran telah berhasil</DialogTitle>
          <DialogDescription>
            E-Slip <span className="font-mono font-semibold text-foreground">{slip.slip_number}</span> sudah
            dibayar di kasir.
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-3 text-left">
          <div>
            <dt className="text-xs text-muted-foreground">Total estimasi</dt>
            <dd className="font-semibold text-foreground">{formatRupiah(slip.total_estimated)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Dibayar pada</dt>
            <dd className="font-semibold text-foreground">{formatDateTime(slip.paid_at)}</dd>
          </div>
        </dl>

        <DialogFooter className="sm:justify-center">
          <Link to="/slips" className={buttonVariants({ variant: "outline" })}>
            Ke Daftar E-Slip
          </Link>
          <DialogClose className={buttonVariants()}>Tutup</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
