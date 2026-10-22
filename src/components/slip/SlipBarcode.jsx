import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"
import { cn } from "@/lib/utils"

// ASCII yang bisa diketik (spasi sampai ~): bisa di-encode Code 128 dan dikirim scanner POS sebagai input keyboard
const CODE128_PATTERN = /^[ -~]+$/

// Quiet zone (margin) minimal 10× lebar modul agar terbaca scanner
const BARCODE_OPTIONS = {
  format: "CODE128",
  width: 3.5,
  height: 120,
  margin: 35,
  displayValue: false,
  background: "#ffffff",
  lineColor: "#000000",
}

export function SlipBarcode({ value, className }) {
  const svgRef = useRef(null)
  const isEncodable = CODE128_PATTERN.test(value)

  useEffect(() => {
    if (isEncodable) JsBarcode(svgRef.current, value, BARCODE_OPTIONS)
  }, [value, isEncodable])

  // Tanpa padding samping/atas: quiet zone sudah ada di dalam SVG
  return (
    <figure className={cn("flex max-w-full flex-col items-center gap-1 rounded-lg bg-white pb-4", className)}>
      {isEncodable && (
        <svg ref={svgRef} role="img" aria-label={`Barcode ${value}`} className="h-auto max-w-full" />
      )}
      <figcaption className="font-mono text-lg font-semibold tracking-widest text-black sm:text-3xl">{value}</figcaption>
    </figure>
  )
}
