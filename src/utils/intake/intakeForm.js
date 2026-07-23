/**
 * @param {object} params
 * @param {string} params.storeName
 * @param {Array<object>} params.items
 * @param {string} [params.defaultCategory]
 */
export function buildIntakePreviewPayload({
  storeName,
  items = [],
  defaultCategory = "other",
}) {
  return {
    storeName: String(storeName || "").trim() || null,
    items: items.map((item, index) => ({
      id: item.id,
      productId: item.productId || null,
      name: item.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      category: item.category || defaultCategory,
      unitPrice:
        item.unitPrice === "" || item.unitPrice == null
          ? null
          : Number(item.unitPrice),
      excluded: Boolean(item.excluded),
      confidence: item.confidence ?? null,
      matchedExisting: Boolean(item.matchedExisting),
      sortOrder: index,
    })),
  };
}

/**
 * @param {{ text: string }} formData
 */
export function buildIntakeParsePayload(formData) {
  return {
    text: String(formData.text || "").trim(),
  };
}
