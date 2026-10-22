import { useEffect, useId, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getCatalogItems } from "@/services/itemService"
import { formatRupiah } from "@/utils/formatters"
import { Loader2, Plus, Search } from "lucide-react"

const SEARCH_DELAY_MS = 300

export function ItemPicker({ onSelect, selectedQuantities = {} }) {
  const listboxId = useId()
  const containerRef = useRef(null)

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [result, setResult] = useState({ key: null, items: [], error: null })

  const loading = open && result.key !== debouncedSearch
  const items = result.items
  const highlighted = Math.min(activeIndex, items.length - 1)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DELAY_MS)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    if (!open) return
    let active = true
    getCatalogItems({ search: debouncedSearch })
      .then((data) => {
        if (active) setResult({ key: debouncedSearch, items: data.items, error: null })
      })
      .catch((error) => {
        if (active) setResult({ key: debouncedSearch, items: [], error })
      })
    return () => {
      active = false
    }
  }, [open, debouncedSearch])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handlePointerDown)
    return () => document.removeEventListener("mousedown", handlePointerDown)
  }, [open])

  function choose(item) {
    onSelect(item)
    setSearch("")
    setActiveIndex(0)
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setOpen(true)
      setActiveIndex(Math.min(highlighted + 1, items.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(Math.max(highlighted - 1, 0))
    } else if (e.key === "Enter") {
      // Never submit the form from the picker
      e.preventDefault()
      if (open && items[highlighted]) choose(items[highlighted])
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-label="Cari item"
        placeholder="Cari SKU atau nama item, lalu klik untuk menambahkan"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setActiveIndex(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="pl-8"
      />

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Memuat item...
            </div>
          ) : result.error ? (
            <p className="px-3 py-3 text-sm text-destructive">{result.error.message}</p>
          ) : items.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">
              {debouncedSearch ? `Tidak ada item yang cocok dengan "${debouncedSearch}"` : "Belum ada item."}
            </p>
          ) : (
            items.map((item, index) => {
              const inSlip = selectedQuantities[item.sku]
              return (
                <div
                  key={item.sku}
                  role="option"
                  aria-selected={index === highlighted}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(item)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm",
                    index === highlighted && "bg-muted"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{item.item_name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{item.sku}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {inSlip && (
                      <Badge variant="secondary" className="font-normal">
                        {inSlip} di slip
                      </Badge>
                    )}
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{formatRupiah(item.effective_price)}</p>
                      {item.discount_price !== null && (
                        <p className="text-xs text-muted-foreground line-through">{formatRupiah(item.original_price)}</p>
                      )}
                    </div>
                    <Plus className="size-4 text-muted-foreground" />
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
