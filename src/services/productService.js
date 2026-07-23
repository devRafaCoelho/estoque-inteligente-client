import { api } from "./apiClient";
import { PRODUCTS_URL } from "./endpoints";
import { buildQueryString } from "../utils/queryString";

const LIST_QUERY_PARAMS = ["search", "category", "status", "active", "page", "pageSize"];

/**
 * @param {Record<string, unknown>} [filters]
 */
export async function listProducts(filters = {}) {
  const query = buildQueryString(filters, LIST_QUERY_PARAMS);
  return api.get(query ? `${PRODUCTS_URL}?${query}` : PRODUCTS_URL);
}

/**
 * @param {string} id
 */
export async function getProductById(id) {
  return api.get(`${PRODUCTS_URL}/${id}`);
}

/**
 * @param {object} payload
 */
export async function createProduct(payload) {
  return api.post(PRODUCTS_URL, payload);
}

/**
 * @param {object[]} products
 */
export async function createProductsBatch(products) {
  return api.post(`${PRODUCTS_URL}/batch`, { products });
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function updateProduct(id, payload) {
  return api.patch(`${PRODUCTS_URL}/${id}`, payload);
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function consumeProduct(id, payload) {
  return api.post(`${PRODUCTS_URL}/${id}/consume`, payload);
}

/**
 * @param {string} id
 */
export async function markProductOut(id) {
  return api.post(`${PRODUCTS_URL}/${id}/mark-out`, {});
}
