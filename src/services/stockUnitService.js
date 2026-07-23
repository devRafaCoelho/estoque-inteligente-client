import { api } from "./apiClient";
import { STOCK_UNITS_URL } from "./endpoints";

/**
 * @typedef {{ code: string, label: string }} StockUnit
 */

/**
 * @returns {Promise<StockUnit[]>}
 */
export async function listStockUnits() {
  const data = await api.get(STOCK_UNITS_URL);
  return data.units || [];
}
