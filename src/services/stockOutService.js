import { api } from "./apiClient";
import { STOCK_OUTS_URL } from "./endpoints";

/**
 * @param {string} text
 */
export async function parseStockOutText(text) {
  return api.post(`${STOCK_OUTS_URL}/parse-text`, { text });
}

/**
 * @param {string} id
 */
export async function getStockOutById(id) {
  return api.get(`${STOCK_OUTS_URL}/${id}`);
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function updateStockOut(id, payload) {
  return api.patch(`${STOCK_OUTS_URL}/${id}`, payload);
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function confirmStockOut(id, payload) {
  return api.post(`${STOCK_OUTS_URL}/${id}/confirm`, payload);
}

/**
 * @param {string} id
 */
export async function cancelStockOut(id) {
  return api.post(`${STOCK_OUTS_URL}/${id}/cancel`, {});
}
