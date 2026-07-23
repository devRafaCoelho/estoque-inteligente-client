import { api } from "./apiClient";
import { PRODUCT_CATEGORIES_URL } from "./endpoints";

/**
 * @typedef {{ code: string, label: string }} ProductCategory
 */

/**
 * @returns {Promise<ProductCategory[]>}
 */
export async function listProductCategories() {
  const data = await api.get(PRODUCT_CATEGORIES_URL);
  return data.categories || [];
}
