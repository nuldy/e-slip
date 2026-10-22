import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"
import { cn } from "@/lib/utils"

// ASCII yang bisa diketik (spasi sampai ~): bisa di-encode Code 128 dan dikirim scanner POS sebagai input keyboard
const CODE128_PATTERN = /^[ -~]+$/

// Bar hitam di atas putih dengan quiet zone 10× lebar modul, agar terbaca scanner POS dari layar HP
const BARCODE_OPTIONS = {
  format: "CODE128",
  width: 3.5,
  height: 120,
  margin: 35,
  displayValue: false,
  background: "#ffffff",
  lineColor: "#000000",
}

/**
 * Code 128 barcode for the POS cashier to scan, with its value printed below.
 * Shown at its native size and only scaled down when the container is narrower.
 *
 * @param {object} props
 * @param {string} props.value - E-Slip barcode value
 * @param {string} [props.className]
 */
export function SlipBarcode({ value, className }) {
  const svgRef = useRef(null)
  const isEncodable = CODE128_PATTERN.test(value)

  useEffect(() => {
    if (isEncodable) JsBarcode(svgRef.current, value, BARCODE_OPTIONS)
  }, [value, isEncodable])

  // Tanpa padding samping/atas: quiet zone sudah ada di dalam SVG, jadi barcode bisa selebar mungkin di layar sempit
  return (
    <figure className={cn("flex max-w-full flex-col items-center gap-1 rounded-lg bg-white pb-4", className)}>
      {isEncodable && (
        <svg ref={svgRef} role="img" aria-label={`Barcode ${value}`} className="h-auto max-w-full" />
      )}
      <figcaption className="font-mono text-lg font-semibold tracking-widest text-black sm:text-3xl">{value}</figcaption>
    </figure>
  )
}
