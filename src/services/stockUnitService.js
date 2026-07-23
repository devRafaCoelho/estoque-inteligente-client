import { apiRequest } from "./apiClient";
import { STOCK_UNITS_URL } from "./endpoints";

/** @returns {Promise<Array<{ code: string, label: string }>>} */
export async function listStockUnits() {
  const data = await apiRequest(STOCK_UNITS_URL);
  return data.units || [];
}
