import { api } from "./apiClient";
import { NOTIFICATIONS_URL } from "./endpoints";
import { buildQueryString } from "../utils/queryString";

const LIST_QUERY_PARAMS = ["unreadOnly", "limit"];

/**
 * @param {Record<string, unknown>} [params]
 */
export async function listNotifications(params = {}) {
  const query = buildQueryString(params, LIST_QUERY_PARAMS);
  return api.get(query ? `${NOTIFICATIONS_URL}?${query}` : NOTIFICATIONS_URL);
}

export async function getUnreadNotificationsCount() {
  return api.get(`${NOTIFICATIONS_URL}/unread-count`);
}

/**
 * @param {string} id
 */
export async function markNotificationRead(id) {
  return api.post(`${NOTIFICATIONS_URL}/${id}/read`, {});
}

export async function markAllNotificationsRead() {
  return api.post(`${NOTIFICATIONS_URL}/read-all`, {});
}
