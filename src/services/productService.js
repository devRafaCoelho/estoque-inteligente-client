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

export const productService = {
  list(filters = {}) {
    return apiRequest(`/api/products${toQuery(filters)}`);
  },

  get(id) {
    return apiRequest(`/api/products/${id}`);
  },

  create(payload) {
    return apiRequest("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return apiRequest(`/api/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  consume(id, payload) {
    return apiRequest(`/api/products/${id}/consume`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  markOut(id) {
    return apiRequest(`/api/products/${id}/mark-out`, {
      method: "POST",
    });
  },
};
