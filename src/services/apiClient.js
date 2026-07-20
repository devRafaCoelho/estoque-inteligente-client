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

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearSessionStorage() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

async function handleResponse(response) {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearSessionStorage();
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/cadastro")) {
        window.location.assign("/login");
      }
    }
    const message = body?.error || body?.message || "Erro na requisição";
    throw new ApiError(message, response.status, body);
  }

  return body;
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
}
