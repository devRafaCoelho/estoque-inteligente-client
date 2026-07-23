import { api } from "./apiClient";
import { PRODUCT_CATEGORIES_URL } from "./endpoints";
import { createCachedLoader } from "../utils/createCachedLoader";

/**
 * @typedef {{ code: string, label: string }} ProductCategory
 */

const productCategoriesLoader = createCachedLoader(async () => {
  const data = await api.get(PRODUCT_CATEGORIES_URL);
  return data.categories || [];
});

/**
 * @param {boolean} [force=false]
 * @returns {Promise<ProductCategory[]>}
 */
export function listProductCategories(force = false) {
  return productCategoriesLoader.load(force === true);
}

export function clearProductCategoriesCache() {
  productCategoriesLoader.clear();
}
