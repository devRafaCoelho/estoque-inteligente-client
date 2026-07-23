import { TOKEN_KEY, USER_KEY } from "../config/constants";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getStoredToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearSessionStorage() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

function extractErrorMessage(body, fallback) {
  if (body && typeof body === "object" && (body.error || body.message)) {
    return body.error || body.message;
  }
  return fallback;
}

async function parseResponseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * @param {string} path
 * @param {{
 *   method?: string,
 *   body?: object,
 *   headers?: Record<string, string>,
 * }} [options]
 */
export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const token = getStoredToken();
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearSessionStorage();
      if (
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/cadastro")
      ) {
        window.location.assign("/login");
      }
    }

    throw new ApiError(
      extractErrorMessage(
        responseBody,
        `Erro na requisição (${response.status})`,
      ),
      response.status,
      responseBody,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return responseBody;
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: "GET" }),
  post: (path, body, options) =>
    apiRequest(path, { ...options, method: "POST", body }),
  patch: (path, body, options) =>
    apiRequest(path, { ...options, method: "PATCH", body }),
  put: (path, body, options) =>
    apiRequest(path, { ...options, method: "PUT", body }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};

export { API_BASE_URL };
