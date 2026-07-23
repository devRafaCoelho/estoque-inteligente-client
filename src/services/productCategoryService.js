import { apiRequest } from "./apiClient";
import { PRODUCT_CATEGORIES_URL } from "./endpoints";

/** @returns {Promise<Array<{ code: string, label: string }>>} */
export async function listProductCategories() {
  const data = await apiRequest(PRODUCT_CATEGORIES_URL);
  return data.categories || [];
}
