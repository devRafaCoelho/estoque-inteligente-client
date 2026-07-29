import { api } from "./apiClient";
import { NF_URL } from "./endpoints";

/**
 * Cobertura de UFs no QR NF-e (público).
 * @returns {Promise<{ priorityStates: string[], supportedStates: string[], states: object[] }>}
 */
export async function getNfCoverage() {
  return api.get(`${NF_URL}/coverage`);
}
