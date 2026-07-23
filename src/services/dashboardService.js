import { api } from "./apiClient";
import { DASHBOARD_URL } from "./endpoints";

export async function getDashboardStats() {
  return api.get(`${DASHBOARD_URL}/stats`);
}
