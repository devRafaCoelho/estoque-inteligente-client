import { api } from "./apiClient";
import { SHOPPING_LISTS_URL } from "./endpoints";

export async function getActiveShoppingList() {
  return api.get(`${SHOPPING_LISTS_URL}/active`);
}

/**
 * @param {string} [mode]
 */
export async function generateShoppingList(mode = "rules") {
  return api.post(`${SHOPPING_LISTS_URL}/generate`, { mode });
}

/**
 * @param {string} viewMode
 */
export async function setShoppingListViewMode(viewMode) {
  return api.patch(`${SHOPPING_LISTS_URL}/view-mode`, { viewMode });
}

/**
 * @param {object} payload
 */
export async function addShoppingListItem(payload) {
  return api.post(`${SHOPPING_LISTS_URL}/items`, payload);
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function updateShoppingListItem(id, payload) {
  return api.patch(`${SHOPPING_LISTS_URL}/items/${id}`, payload);
}

/**
 * @param {string} id
 */
export async function deleteShoppingListItem(id) {
  return api.delete(`${SHOPPING_LISTS_URL}/items/${id}`);
}
