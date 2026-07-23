/**
 * Monta query string a partir de um objeto de filtros,
 * incluindo apenas as chaves permitidas e ignorando vazios.
 *
 * @param {Record<string, unknown>} [filters]
 * @param {string[]} [allowedKeys]
 * @returns {string}
 */
export function buildQueryString(filters = {}, allowedKeys = []) {
  const params = new URLSearchParams();

  for (const key of allowedKeys) {
    const value = filters[key];
    if (value == null || value === "") continue;
    const trimmed = String(value).trim();
    if (trimmed) params.set(key, trimmed);
  }

  return params.toString();
}
