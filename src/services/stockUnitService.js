import { api } from "./apiClient";
import { STOCK_UNITS_URL } from "./endpoints";
import { createCachedLoader } from "../utils/createCachedLoader";

/**
 * @typedef {{ code: string, label: string }} StockUnit
 */

const stockUnitsLoader = createCachedLoader(async () => {
  const data = await api.get(STOCK_UNITS_URL);
  return data.units || [];
});

/**
 * @param {boolean} [force=false]
 * @returns {Promise<StockUnit[]>}
 */
export function listStockUnits(force = false) {
  return stockUnitsLoader.load(force === true);
}

export function clearStockUnitsCache() {
  stockUnitsLoader.clear();
}
