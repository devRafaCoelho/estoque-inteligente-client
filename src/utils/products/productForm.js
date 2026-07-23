export const PRODUCT_FORM_DEFAULT_VALUES = {
  name: "",
  category: "",
  quantity: 0,
  unit: "",
  minQuantity: 0,
  notes: "",
};

/**
 * @param {typeof PRODUCT_FORM_DEFAULT_VALUES} formData
 */
export function buildCreateProductPayload(formData) {
  return {
    name: String(formData.name || "").trim(),
    category: formData.category,
    quantity: Number(formData.quantity),
    unit: formData.unit,
    minQuantity: Number(formData.minQuantity),
    notes: formData.notes || "",
  };
}

/**
 * @param {Array<object>} stagedItems
 */
export function buildCreateProductsBatchPayload(stagedItems = []) {
  return stagedItems.map((item) =>
    buildCreateProductPayload({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      minQuantity: item.minQuantity,
      notes: item.notes,
    }),
  );
}

/**
 * @param {{ quantity: number|string, note?: string|null }} formData
 */
export function buildConsumeProductPayload(formData) {
  return {
    quantity: Number(formData.quantity),
    note: formData.note || null,
  };
}
