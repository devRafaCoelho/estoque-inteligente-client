import { api } from "./apiClient";
import { BRAZILIAN_STATES_URL } from "./endpoints";

/**
 * @typedef {{ code: string, name: string }} BrazilianState
 */

/**
 * @returns {Promise<BrazilianState[]>}
 */
export async function listBrazilianStates() {
  const data = await api.get(BRAZILIAN_STATES_URL);
  return data.states || [];
}
