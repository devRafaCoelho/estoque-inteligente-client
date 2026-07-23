import { apiRequest } from "./apiClient";
import { BRAZILIAN_STATES_URL } from "./endpoints";

/** @returns {Promise<Array<{ code: string, name: string }>>} */
export async function listBrazilianStates() {
  const data = await apiRequest(BRAZILIAN_STATES_URL);
  return data.states || [];
}
