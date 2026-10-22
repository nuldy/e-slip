export function formatRupiah(amount) {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "Rp 0"
  }
  return `Rp ${amount.toLocaleString("id-ID")}`
}

const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function formatDateTime(value) {
  if (!value) return "-"
  const date = new Date(value)
  return isNaN(date.getTime()) ? "-" : dateTimeFormatter.format(date)
}
