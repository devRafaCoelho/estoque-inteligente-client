import { api } from "./apiClient";
import { NOTIFICATIONS_URL } from "./endpoints";
import { buildQueryString } from "../utils/queryString";
import { createCachedLoader } from "../utils/createCachedLoader";

const LIST_QUERY_PARAMS = ["unreadOnly", "limit"];

/** Disparado quando o contador de não lidas muda (badge do header). */
export const UNREAD_NOTIFICATIONS_CHANGED_EVENT = "estoque:unread-notifications-changed";

function emitUnreadNotificationsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(UNREAD_NOTIFICATIONS_CHANGED_EVENT));
}

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
  emitUnreadNotificationsChanged();
  return data;
}

export async function markAllNotificationsRead() {
  const data = await api.post(`${NOTIFICATIONS_URL}/read-all`, {});
  clearUnreadNotificationsCountCache();
  emitUnreadNotificationsChanged();
  return data;
}
