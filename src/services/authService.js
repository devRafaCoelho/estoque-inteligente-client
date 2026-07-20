import { apiRequest } from "./apiClient";

export const authService = {
  register(payload) {
    return apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload) {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  me() {
    return apiRequest("/api/auth/me");
  },
};
