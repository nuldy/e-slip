export const SPO_CHECK_STATUS = {
  MATCH: "match",
  MISSING: "missing",
  INSUFFICIENT: "insufficient",
}

function sumQuantityBySku(items) {
  const totals = new Map()
  for (const item of items) {
    totals.set(item.sku, (totals.get(item.sku) || 0) + (Number(item.quantity) || 0))
  }
  return totals
}

function getCheckStatus(spoQuantity, slipQuantity) {
  if (slipQuantity === undefined) return SPO_CHECK_STATUS.MISSING
  if (spoQuantity > slipQuantity) return SPO_CHECK_STATUS.INSUFFICIENT
  return SPO_CHECK_STATUS.MATCH
}

// Aturan sama dengan validasi backend, yang tetap menjadi penentu akhir saat E-Slip disimpan
export function checkSpoItems(spoItems, slipItems) {
  const slipQuantities = sumQuantityBySku(slipItems)

  return spoItems.map((spoItem) => {
    const slipQuantity = slipQuantities.get(spoItem.sku)
    return {
      sku: spoItem.sku,
      item_name: spoItem.item_name,
      spo_quantity: spoItem.quantity,
      slip_quantity: slipQuantity ?? 0,
      status: getCheckStatus(spoItem.quantity, slipQuantity),
    }
  })
}

export function countSpoMismatches(checks) {
  return checks.filter((check) => check.status !== SPO_CHECK_STATUS.MATCH).length
}
