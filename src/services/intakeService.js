import { apiRequest } from "./apiClient";

export const intakeService = {
  parseText(text) {
    return apiRequest("/api/intakes/parse-text", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  get(id) {
    return apiRequest(`/api/intakes/${id}`);
  },

  update(id, payload) {
    return apiRequest(`/api/intakes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  confirm(id, payload) {
    return apiRequest(`/api/intakes/${id}/confirm`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  cancel(id) {
    return apiRequest(`/api/intakes/${id}/cancel`, {
      method: "POST",
    });
  },
};
