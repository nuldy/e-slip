import { useEffect, useRef, useState } from "react"
import { getSlipDetail } from "@/services/slipService"
import { isBarcodeActive } from "@/utils/slip"

// Backend belum punya push/realtime, jadi status dari POS (Locked → Paid) diambil berkala
const REFRESH_INTERVAL_MS = 5000

export function useSlipDetail(slipNumber) {
  const [reloadCount, setReloadCount] = useState(0)
  const [result, setResult] = useState({ key: null, slip: null, error: null })
  const [refreshFailed, setRefreshFailed] = useState(false)
  const [paidSlipNumber, setPaidSlipNumber] = useState(null)
  const lastStatusRef = useRef(null)

  const requestKey = `${slipNumber}|${reloadCount}`
  const loading = result.key !== requestKey
  const slip = loading ? null : result.slip
  const live = isBarcodeActive(slip?.status)

  useEffect(() => {
    let active = true
    getSlipDetail(slipNumber)
      .then((data) => {
        if (!active) return
        lastStatusRef.current = data.status
        setRefreshFailed(false)
        setResult({ key: requestKey, slip: data, error: null })
      })
      .catch((error) => {
        if (active) setResult({ key: requestKey, slip: null, error })
      })
    return () => {
      active = false
    }
  }, [requestKey, slipNumber])

  // Hanya selama slip masih bisa diproses kasir; berhenti di status akhir dan saat tab tidak terlihat
  useEffect(() => {
    if (!live) return

    let active = true
    let timer = null
    let inFlight = false

    async function refresh() {
      clearTimeout(timer)
      timer = null
      if (inFlight || document.visibilityState === "hidden") return

      inFlight = true
      try {
        const data = await getSlipDetail(slipNumber)
        if (!active) return
        const previousStatus = lastStatusRef.current
        lastStatusRef.current = data.status
        setRefreshFailed(false)
        setResult((prev) => ({ ...prev, slip: data }))
        if (data.status === "Paid" && previousStatus !== "Paid") setPaidSlipNumber(slipNumber)
      } catch {
        // Data terakhir tetap ditampilkan; 401 sudah ditangani apiClient (auto-logout)
        if (active) setRefreshFailed(true)
      } finally {
        inFlight = false
      }

      if (active) timer = setTimeout(refresh, REFRESH_INTERVAL_MS)
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") refresh()
    }

    timer = setTimeout(refresh, REFRESH_INTERVAL_MS)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      active = false
      clearTimeout(timer)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [live, slipNumber])

  return {
    slip,
    error: loading ? null : result.error,
    loading,
    live,
    refreshFailed,
    reload: () => setReloadCount((n) => n + 1),
    paymentConfirmed: paidSlipNumber === slipNumber,
    dismissPaymentConfirmed: () => setPaidSlipNumber(null),
  }
}
