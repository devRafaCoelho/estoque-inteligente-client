import { api } from "./apiClient";
import { FINANCE_URL } from "./endpoints";
import { buildQueryString } from "../utils/queryString";

export async function getFinanceSummary() {
  return api.get(`${FINANCE_URL}/summary`);
}

/**
 * @param {{ year?: number|string, month?: number|string }} [params]
 */
export async function getFinanceByCategory({ year, month } = {}) {
  const query = buildQueryString({ year, month }, ["year", "month"]);
  return api.get(
    query ? `${FINANCE_URL}/by-category?${query}` : `${FINANCE_URL}/by-category`,
  );
}

/**
 * @param {{ year?: number|string }} [params]
 */
export async function getFinanceSeries({ year } = {}) {
  const query = buildQueryString({ year }, ["year"]);
  return api.get(query ? `${FINANCE_URL}/series?${query}` : `${FINANCE_URL}/series`);
}

/**
 * @param {{ year?: number|string, month?: number|string }} [params]
 */
export async function getFinanceTips({ year, month } = {}) {
  const query = buildQueryString({ year, month }, ["year", "month"]);
  return api.get(query ? `${FINANCE_URL}/tips?${query}` : `${FINANCE_URL}/tips`);
}
