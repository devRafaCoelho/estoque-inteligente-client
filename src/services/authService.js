import { ApiError, api } from "./apiClient";
import { AUTH_URL } from "./endpoints";

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

/**
 * @param {object} payload
 */
export async function register(payload) {
  return api.post(`${AUTH_URL}/register`, payload);
}

/**
 * @param {{ email: string, password: string }} credentials
 */
export async function login(credentials) {
  return api.post(`${AUTH_URL}/login`, credentials);
}

/**
 * @param {{ idToken: string }} payload
 */
export async function loginWithGoogle(payload) {
  return withNetworkRetry(() => api.post(`${AUTH_URL}/google`, payload));
}

/**
 * @param {{ idToken: string, fullName?: string|null }} payload
 */
export async function loginWithApple(payload) {
  return withNetworkRetry(() =>
    api.post(`${AUTH_URL}/apple`, {
      idToken: payload.idToken,
      fullName: payload.fullName || null,
    }),
  );
}

/**
 * @param {{ idToken: string }} payload
 */
export async function linkGoogle(payload) {
  return api.post(`${AUTH_URL}/link/google`, payload);
}

/**
 * @param {{ idToken: string, fullName?: string|null }} payload
 */
export async function linkApple(payload) {
  return api.post(`${AUTH_URL}/link/apple`, {
    idToken: payload.idToken,
    fullName: payload.fullName || null,
  });
}

/** @returns {Promise<{ user: object }>} */
export async function getMe() {
  return api.get(`${AUTH_URL}/me`);
}
