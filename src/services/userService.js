import { api } from "./apiClient";
import { USERS_URL } from "./endpoints";
import { createCachedLoader } from "../utils/createCachedLoader";

/**
 * @param {object} payload
 */
export async function updateMe(payload) {
  return api.patch(`${USERS_URL}/me`, payload);
}

const preferencesLoader = createCachedLoader(() =>
  api.get(`${USERS_URL}/me/preferences`),
);

/**
 * @param {boolean} [force=false]
 */
export function getMyPreferences(force = false) {
  return preferencesLoader.load(force === true);
}

export function clearMyPreferencesCache() {
  preferencesLoader.clear();
}

/**
 * @param {object} payload
 */
export async function updateMyPreferences(payload) {
  const data = await api.patch(`${USERS_URL}/me/preferences`, payload);
  preferencesLoader.clear();
  return data;
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
