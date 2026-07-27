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
    items: items.map((item, index) => {
      const quantity = Number(item.quantity);
      const rawPrice = item.unitPrice;
      let unitPrice = null;
      if (rawPrice !== "" && rawPrice != null) {
        const parsed = Number(rawPrice);
        unitPrice = Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
      }

      return {
        id: item.id || null,
        productId: item.productId || null,
        name: String(item.name || "").trim(),
        quantity: Number.isFinite(quantity) ? quantity : 0,
        unit: item.unit || "un",
        category: item.category || defaultCategory,
        unitPrice,
        excluded: Boolean(item.excluded),
        confidence: (() => {
          if (item.confidence == null || item.confidence === "") return null;
          const n = Number(item.confidence);
          return Number.isFinite(n) ? n : null;
        })(),
        matchedExisting: Boolean(item.matchedExisting),
        sortOrder: index,
      };
    }),
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
