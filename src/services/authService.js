import { apiRequest, ApiError } from "./apiClient";

async function withNetworkRetry(requestFn, { retries = 1 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (err) {
      lastError = err;
      const isTransientStatus =
        err instanceof ApiError && (err.status === 502 || err.status === 503);
      const isNetwork =
        !(err instanceof ApiError) &&
        (err?.name === "TypeError" ||
          /failed to fetch|network|econnreset|load failed/i.test(
            String(err?.message || ""),
          ));
      if ((!isNetwork && !isTransientStatus) || attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
  throw lastError;
}

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
    return withNetworkRetry(() =>
      apiRequest("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      }),
    );
  },

  loginWithApple({ idToken, fullName }) {
    return withNetworkRetry(() =>
      apiRequest("/api/auth/apple", {
        method: "POST",
        body: JSON.stringify({ idToken, fullName: fullName || null }),
      }),
    );
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
