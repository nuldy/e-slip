import { useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSpo } from "@/services/spoService"
import { Loader2, Search } from "lucide-react"

export function SpoLookup({ spoNumber, onSpoNumberChange, onSpoChange }) {
  const latestRequest = useRef(0)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    latestRequest.current += 1
    setSearching(false)
    setError("")
    onSpoNumberChange(e.target.value)
    onSpoChange(null)
  }

  async function search() {
    const number = spoNumber.trim()
    if (!number) {
      setError("Isi nomor SPO terlebih dahulu.")
      return
    }

    const requestId = ++latestRequest.current
    const isLatest = () => requestId === latestRequest.current
    setSearching(true)
    setError("")
    onSpoChange(null)

    try {
      const spo = await getSpo(number)
      if (isLatest()) onSpoChange(spo)
    } catch (err) {
      if (isLatest()) setError(err.message || "Gagal mencari SPO")
    } finally {
      if (isLatest()) setSearching(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key !== "Enter") return
    // Enter mencari SPO, bukan men-submit form E-Slip
    e.preventDefault()
    search()
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          type="search"
          aria-label="Nomor SPO"
          placeholder="Cari nomor SPO"
          maxLength={50}
          value={spoNumber}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          variant="outline"
          onClick={search}
          disabled={searching}
          className="cursor-pointer gap-1.5"
        >
          {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Cari
        </Button>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
