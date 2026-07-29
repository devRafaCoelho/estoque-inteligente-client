import { api } from "./apiClient";
import { SHOPPING_LIST_SHARES_URL } from "./endpoints";

/**
 * Cria link compartilhável da lista ativa.
 * @returns {Promise<{ shareId: string, token: string, expiresAt: string, listId: string }>}
 */
export async function createShoppingListShare() {
  return api.post(SHOPPING_LIST_SHARES_URL);
}

/**
 * Lista shares ativos da lista ativa.
 */
export async function listShoppingListShares() {
  return api.get(SHOPPING_LIST_SHARES_URL);
}

/**
 * Revoga um share.
 * @param {string} shareId
 */
export async function revokeShoppingListShare(shareId) {
  return api.delete(`${SHOPPING_LIST_SHARES_URL}/${shareId}`);
}
