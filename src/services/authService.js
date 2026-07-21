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

  loginWithGoogle({ idToken }) {
    return apiRequest("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  },

  loginWithApple({ idToken, fullName }) {
    return apiRequest("/api/auth/apple", {
      method: "POST",
      body: JSON.stringify({ idToken, fullName: fullName || null }),
    });
  },

  linkGoogle({ idToken }) {
    return apiRequest("/api/auth/link/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  },

  linkApple({ idToken, fullName }) {
    return apiRequest("/api/auth/link/apple", {
      method: "POST",
      body: JSON.stringify({ idToken, fullName: fullName || null }),
    });
  },

  me() {
    return apiRequest("/api/auth/me");
  },
};
