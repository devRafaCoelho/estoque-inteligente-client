/**
 * Paths da API. Para migrar o prefixo (ex.: `/api` → `/v1`), altere só `API_PREFIX`.
 */
export const API_PREFIX = "/api";

export const AUTH_URL = `${API_PREFIX}/auth`;
export const USERS_URL = `${API_PREFIX}/users`;
export const PRODUCTS_URL = `${API_PREFIX}/products`;
export const INTAKES_URL = `${API_PREFIX}/intakes`;
export const STOCK_OUTS_URL = `${API_PREFIX}/stock-outs`;
export const SHOPPING_LISTS_URL = `${API_PREFIX}/shopping-lists`;
export const SHOPPING_LIST_SHARES_URL = `${SHOPPING_LISTS_URL}/shares`;
export const FINANCE_URL = `${API_PREFIX}/finance`;
export const DASHBOARD_URL = `${API_PREFIX}/dashboard`;
export const NOTIFICATIONS_URL = `${API_PREFIX}/notifications`;
export const PRODUCT_CATEGORIES_URL = `${API_PREFIX}/product-categories`;
export const STOCK_UNITS_URL = `${API_PREFIX}/stock-units`;
export const BRAZILIAN_STATES_URL = `${API_PREFIX}/brazilian-states`;
export const CHAT_URL = `${API_PREFIX}/chat`;
export const HOUSEHOLDS_URL = `${API_PREFIX}/households`;
