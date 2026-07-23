import { api } from "./apiClient";
import { FINANCE_URL } from "./endpoints";
import { buildQueryString } from "../utils/queryString";

export async function getFinanceSummary() {
  return api.get(`${FINANCE_URL}/summary`);
}

/**
 * @param {{ year?: number|string }} [params]
 */
export async function getFinanceSeries({ year } = {}) {
  const query = buildQueryString({ year }, ["year"]);
  return api.get(query ? `${FINANCE_URL}/series?${query}` : `${FINANCE_URL}/series`);
}

export async function getFinanceTips() {
  return api.get(`${FINANCE_URL}/tips`);
}
