import { apiRequest } from "./apiClient";

export const stockOutService = {
  parseText(text) {
    return apiRequest("/api/stock-outs/parse-text", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  get(id) {
    return apiRequest(`/api/stock-outs/${id}`);
  },

  update(id, payload) {
    return apiRequest(`/api/stock-outs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  confirm(id, payload) {
    return apiRequest(`/api/stock-outs/${id}/confirm`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  cancel(id) {
    return apiRequest(`/api/stock-outs/${id}/cancel`, {
      method: "POST",
    });
  },
};
