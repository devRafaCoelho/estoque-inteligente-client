import { ApiError, api } from "./apiClient";
import { AUTH_URL } from "./endpoints";

function isRetryableAuthError(err) {
  if (err instanceof ApiError) {
    return err.status === 502 || err.status === 503 || err.status === 504;
  }
  return (
    err?.name === "TypeError" ||
    /failed to fetch|network|econnreset|load failed|timeout/i.test(
      String(err?.message || ""),
    )
  );
}

/**
 * Retry com backoff — cobre cold start do Render free (~20–60s).
 */
async function withNetworkRetry(
  requestFn,
  { retries = 3, baseDelayMs = 1500 } = {},
) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (err) {
      lastError = err;
      if (!isRetryableAuthError(err) || attempt === retries) throw err;
      const wait = baseDelayMs * (attempt + 1);
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }
  throw lastError;
}

export function socialAuthErrorMessage(err, fallback) {
  if (err instanceof ApiError && err.message) return err.message;
  return fallback || "Não foi possível entrar. Tente novamente.";
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
 * @param {{ email: string }} payload
 */
export async function forgotPassword(payload) {
  return api.post(`${AUTH_URL}/forgot-password`, payload);
}

/**
 * @param {{ token: string, password: string }} payload
 */
export async function resetPassword(payload) {
  return api.post(`${AUTH_URL}/reset-password`, payload);
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
