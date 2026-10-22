import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { LoadingState } from "@/components/common/LoadingState"
import { ErrorState } from "@/components/common/ErrorState"
import { SlipStatusBadge } from "@/components/slip/SlipStatusBadge"
import { useAuth } from "@/hooks/useAuth"
import { getSlips } from "@/services/slipService"
import { formatDateTime, formatRupiah } from "@/utils/formatters"
import { SLIP_STATUSES, getStatusLabel } from "@/utils/slip"
import { ChevronLeft, ChevronRight, Plus, ReceiptText, Search } from "lucide-react"

const PAGE_SIZE = 10

const headClass = "py-4 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground"

/**
 * Slip list page component.
 * Lists the store's e-slips with search, status filter and pagination.
 * Filters live in the URL query string so they survive navigation to a slip and back.
 */
export function SlipListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1)
  const status = searchParams.get("status") || ""
  const search = searchParams.get("search") || ""

  const [searchInput, setSearchInput] = useState(search)
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  const requestKey = `${page}|${status}|${search}|${reloadCount}`
  const loading = result.key !== requestKey

  useEffect(() => {
    let active = true
    getSlips({ page, limit: PAGE_SIZE, status, search })
      .then((data) => {
        if (active) setResult({ key: requestKey, data, error: null })
      })
      .catch((error) => {
        if (active) setResult({ key: requestKey, data: null, error })
      })
    return () => {
      active = false
    }
  }, [requestKey, page, status, search])

  /** Updates filter params; any filter change goes back to page 1. */
  function updateParams(changes) {
    const next = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    if (!("page" in changes)) next.delete("page")
    setSearchParams(next)
  }

  function handleSearchSubmit(e) {
    e.preventDefault()
    updateParams({ search: searchInput.trim() })
  }

  const slips = result.data?.slips ?? []
  const pagination = result.data?.pagination
  const hasFilters = Boolean(status || search)

  return (
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
              Kelola dan pantau seluruh transaksi e-slip untuk toko {user?.store_code}
            </p>
          </div>

          <Button
            onClick={() => navigate("/slips/new")}
            className="gap-2 cursor-pointer w-full sm:w-auto font-medium"
          >
            <Plus className="size-4" />
            Buat E-Slip
          </Button>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={status === "" ? "default" : "outline"}
            onClick={() => updateParams({ status: "" })}
            className="cursor-pointer"
          >
            Semua
          </Button>
          {SLIP_STATUSES.map((value) => (
            <Button
              key={value}
              size="sm"
              variant={status === value ? "default" : "outline"}
              onClick={() => updateParams({ status: value })}
              className="cursor-pointer"
            >
              {getStatusLabel(value)}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex w-full gap-2 lg:w-96">
          <Input
            type="search"
            placeholder="Cari no. slip, nama, atau no HP"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button type="submit" variant="outline" className="cursor-pointer gap-1.5">
            <Search className="size-4" />
            Cari
          </Button>
        </form>
      </div>

      {/* Table */}
      <div className="w-full overflow-hidden rounded-xl border bg-card shadow-xs">
        {loading ? (
          <LoadingState label="Memuat daftar e-slip..." />
        ) : result.error ? (
          <ErrorState message={result.error.message} onRetry={() => setReloadCount((n) => n + 1)} />
        ) : (
          <Table className="w-full">
            <TableHeader className="bg-muted/70 border-b">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className={headClass}>No. Slip</TableHead>
                <TableHead className={headClass}>Customer</TableHead>
                <TableHead className={`${headClass} text-right`}>Total Estimasi</TableHead>
                <TableHead className={`${headClass} text-center`}>Status</TableHead>
                <TableHead className={headClass}>Dibuat</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {slips.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ReceiptText className="size-8 text-muted-foreground/40" />
                      {hasFilters ? (
                        <p className="font-medium text-base">Tidak ada e-slip yang cocok dengan filter</p>
                      ) : (
                        <>
                          <p className="font-medium text-base">Belum ada e-slip</p>
                          <p className="text-sm text-muted-foreground">
                            Klik tombol &quot;Buat E-Slip&quot; untuk membuat pesanan baru.
                          </p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                slips.map((slip) => (
                  <TableRow
                    key={slip.id}
                    onClick={() => navigate(`/slips/${slip.slip_number}`)}
                    className="cursor-pointer hover:bg-muted/30 transition-colors border-b last:border-b-0"
                  >
                    <TableCell className="py-4 px-6 font-mono font-semibold text-foreground">
                      <Link
                        to={`/slips/${slip.slip_number}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        {slip.slip_number}
                      </Link>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-foreground/90 font-medium">
                      {slip.customer_name}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right font-bold text-foreground">
                      {formatRupiah(slip.total_estimated)}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <SlipStatusBadge status={slip.status} />
                    </TableCell>
                    <TableCell className="py-4 px-6 text-sm text-muted-foreground">
                      {formatDateTime(slip.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !result.error && pagination && pagination.total_records > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Halaman {pagination.page} dari {pagination.total_pages} · {pagination.total_records} e-slip
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => updateParams({ page: String(pagination.page - 1) })}
              className="cursor-pointer gap-1"
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => updateParams({ page: String(pagination.page + 1) })}
              className="cursor-pointer gap-1"
            >
              Berikutnya
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
