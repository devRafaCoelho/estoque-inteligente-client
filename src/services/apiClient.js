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
 *   body?: object | FormData,
 *   headers?: Record<string, string>,
 * }} [options]
 */
export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const token = getStoredToken();
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    // Só 401 encerra sessão. 403 é falta de permissão (ex.: member vs owner).
    if (response.status === 401) {
      clearSessionStorage();
      const path = window.location.pathname;
      const isPublicAuthPath =
        path.startsWith("/login") ||
        path.startsWith("/cadastro") ||
        path.startsWith("/esqueci-senha") ||
        path.startsWith("/resetar-senha") ||
        path.startsWith("/lista-compartilhada");
      if (!isPublicAuthPath) {
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
  /** Multipart (ex.: foto da nota). Não define Content-Type — o browser envia o boundary. */
  postFormData: (path, formData, options) =>
    apiRequest(path, { ...options, method: "POST", body: formData }),
  patch: (path, body, options) =>
    apiRequest(path, { ...options, method: "PATCH", body }),
  put: (path, body, options) =>
    apiRequest(path, { ...options, method: "PUT", body }),
  delete: (path, options) => apiRequest(path, { ...options, method: "DELETE" }),
};

export { API_BASE_URL };
