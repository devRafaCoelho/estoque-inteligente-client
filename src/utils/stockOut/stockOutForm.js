/**
 * @param {object} params
 * @param {Array<object>} params.items
 */
export function buildStockOutPreviewPayload({ items = [] }) {
  return {
    items: items.map((item, index) => ({
      id: item.id,
      productId: item.productId || null,
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      excluded: Boolean(item.excluded),
      allowZero: Boolean(item.allowZero),
      confidence: item.confidence ?? null,
      matchedExisting: Boolean(item.matchedExisting),
      availableQty: item.availableQty ?? null,
      warning: item.warning || null,
      sortOrder: index,
    })),
  };
}

/**
 * @param {{ text: string }} formData
 */
export function buildStockOutParsePayload(formData) {
  return {
    text: String(formData.text || "").trim(),
  };
}
