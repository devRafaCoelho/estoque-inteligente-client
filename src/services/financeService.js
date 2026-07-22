import { apiRequest } from "./apiClient";

export const financeService = {
  getSummary() {
    return apiRequest("/api/finance/summary");
  },

  getSeries({ weeks = 8 } = {}) {
    const params = new URLSearchParams();
    if (weeks) params.set("weeks", String(weeks));
    const query = params.toString();
    return apiRequest(`/api/finance/series${query ? `?${query}` : ""}`);
  },

  getTips() {
    return apiRequest("/api/finance/tips");
  },
};
