import { api } from "./apiClient";
import { INTAKES_URL } from "./endpoints";

/**
 * @param {string} text
 */
export async function parseIntakeText(text) {
  return api.post(`${INTAKES_URL}/parse-text`, { text });
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
