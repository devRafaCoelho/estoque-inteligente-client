import { apiRequest } from "./apiClient";

export const dashboardService = {
  getStats() {
    return apiRequest("/api/dashboard/stats");
  },
};
