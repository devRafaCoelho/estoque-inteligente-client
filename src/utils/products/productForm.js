export const PRODUCT_FORM_DEFAULT_VALUES = {
  name: "",
  category: "",
  quantity: 0,
  unit: "",
  minQuantity: 0,
  avgUnitPrice: null,
  repurchaseDays: null,
  notes: "",
};

function normalizeRepurchaseDays(value) {
  if (value === "" || value == null) return null;
  const days = Number(value);
  return Number.isFinite(days) && days >= 1 ? Math.trunc(days) : null;
}

function normalizeAvgUnitPrice(value) {
  if (value === "" || value == null) return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

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
    avgUnitPrice: normalizeAvgUnitPrice(formData.avgUnitPrice),
    repurchaseDays: normalizeRepurchaseDays(formData.repurchaseDays),
    notes: formData.notes || "",
  };
}

/**
 * Payload de PATCH — mesmos campos editáveis do formulário.
 * @param {typeof PRODUCT_FORM_DEFAULT_VALUES} formData
 */
export function buildUpdateProductPayload(formData) {
  return buildCreateProductPayload(formData);
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
      avgUnitPrice: item.avgUnitPrice,
      repurchaseDays: item.repurchaseDays,
      notes: item.notes,
    }),
  );
}

/**
 * Valores iniciais do formulário a partir do produto da API.
 * @param {object} product
 */
export function productToFormValues(product) {
  return {
    name: product?.name || "",
    category: product?.category || "",
    quantity: product?.quantity ?? "",
    unit: product?.unit || "",
    minQuantity: product?.minQuantity ?? "",
    avgUnitPrice: product?.avgUnitPrice ?? null,
    repurchaseDays: product?.repurchaseDays ?? null,
    notes: product?.notes || "",
  };
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
