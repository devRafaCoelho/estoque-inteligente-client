import { apiRequest } from "./apiClient";

export const financeService = {
  getSummary() {
    return apiRequest("/api/finance/summary");
  },

  getSeries({ year } = {}) {
    const params = new URLSearchParams();
    if (year) params.set("year", String(year));
    const query = params.toString();
    return apiRequest(`/api/finance/series${query ? `?${query}` : ""}`);
  },

  getTips() {
    return apiRequest("/api/finance/tips");
  },
};
