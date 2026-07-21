import { apiRequest } from "./apiClient";

function toQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.set(key, String(value));
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
}

export const notificationService = {
  list(params = {}) {
    return apiRequest(`/api/notifications${toQuery(params)}`);
  },

  unreadCount() {
    return apiRequest("/api/notifications/unread-count");
  },

  markRead(id) {
    return apiRequest(`/api/notifications/${id}/read`, {
      method: "POST",
    });
  },

  markAllRead() {
    return apiRequest("/api/notifications/read-all", {
      method: "POST",
    });
  },
};
