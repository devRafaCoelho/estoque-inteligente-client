import { api } from "./apiClient";
import { INTAKES_URL } from "./endpoints";

/**
 * @param {{ status?: string, limit?: number }} [params]
 */
export async function listIntakes(params = {}) {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.limit != null) search.set("limit", String(params.limit));
  const query = search.toString();
  return api.get(`${INTAKES_URL}${query ? `?${query}` : ""}`);
}

/**
 * @param {{ text: string }} payload
 */
export async function parseIntakeText(payload) {
  return api.post(`${INTAKES_URL}/parse-text`, payload);
}

/**
 * @param {string} id
 */
export async function getIntakeById(id) {
  return api.get(`${INTAKES_URL}/${id}`);
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function updateIntake(id, payload) {
  return api.patch(`${INTAKES_URL}/${id}`, payload);
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function confirmIntake(id, payload) {
  return api.post(`${INTAKES_URL}/${id}/confirm`, payload);
}

/**
 * @param {string} id
 */
export async function cancelIntake(id) {
  return api.post(`${INTAKES_URL}/${id}/cancel`, {});
}

export async function clearIntakeDrafts() {
  return api.post(`${INTAKES_URL}/clear-drafts`, {});
}
