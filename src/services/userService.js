import { apiRequest } from "./apiClient";

export const userService = {
  updateMe(payload) {
    return apiRequest("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  getPreferences() {
    return apiRequest("/api/users/me/preferences");
  },

  updatePreferences(payload) {
    return apiRequest("/api/users/me/preferences", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  changePassword(payload) {
    return apiRequest("/api/users/me/password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  deleteAccount() {
    return apiRequest("/api/users/me", { method: "DELETE" });
  },
};
