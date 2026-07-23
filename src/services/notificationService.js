import { api } from "./apiClient";
import { NOTIFICATIONS_URL } from "./endpoints";
import { buildQueryString } from "../utils/queryString";
import { createCachedLoader } from "../utils/createCachedLoader";

const LIST_QUERY_PARAMS = ["unreadOnly", "limit"];

/**
 * @param {Record<string, unknown>} [params]
 */
export async function listNotifications(params = {}) {
  const query = buildQueryString(params, LIST_QUERY_PARAMS);
  return api.get(query ? `${NOTIFICATIONS_URL}?${query}` : NOTIFICATIONS_URL);
}

const unreadCountLoader = createCachedLoader(() =>
  api.get(`${NOTIFICATIONS_URL}/unread-count`),
);

/**
 * @param {boolean} [force=false]
 */
export function getUnreadNotificationsCount(force = false) {
  return unreadCountLoader.load(force === true);
}

export function clearUnreadNotificationsCountCache() {
  unreadCountLoader.clear();
}

/**
 * @param {string} id
 */
export async function markNotificationRead(id) {
  const data = await api.post(`${NOTIFICATIONS_URL}/${id}/read`, {});
  clearUnreadNotificationsCountCache();
  return data;
}

export async function markAllNotificationsRead() {
  const data = await api.post(`${NOTIFICATIONS_URL}/read-all`, {});
  clearUnreadNotificationsCountCache();
  return data;
}
