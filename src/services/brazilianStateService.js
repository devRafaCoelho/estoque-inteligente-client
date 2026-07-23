import { api } from "./apiClient";
import { BRAZILIAN_STATES_URL } from "./endpoints";
import { createCachedLoader } from "../utils/createCachedLoader";

/**
 * @typedef {{ code: string, name: string }} BrazilianState
 */

const brazilianStatesLoader = createCachedLoader(async () => {
  const data = await api.get(BRAZILIAN_STATES_URL);
  return data.states || [];
});

/**
 * @param {boolean} [force=false]
 * @returns {Promise<BrazilianState[]>}
 */
export function listBrazilianStates(force = false) {
  return brazilianStatesLoader.load(force === true);
}

export function clearBrazilianStatesCache() {
  brazilianStatesLoader.clear();
}
