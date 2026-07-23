import { api } from "./apiClient";
import { USERS_URL } from "./endpoints";

/**
 * @param {object} payload
 */
export async function updateMe(payload) {
  return api.patch(`${USERS_URL}/me`, payload);
}

export async function getMyPreferences() {
  return api.get(`${USERS_URL}/me/preferences`);
}

/**
 * @param {object} payload
 */
export async function updateMyPreferences(payload) {
  return api.patch(`${USERS_URL}/me/preferences`, payload);
}

/**
 * @param {object} payload
 */
export async function changeMyPassword(payload) {
  return api.post(`${USERS_URL}/me/password`, payload);
}

export async function deleteMyAccount() {
  return api.delete(`${USERS_URL}/me`);
}
