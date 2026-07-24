/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isFilled(value) {
  if (value == null) return false;
  if (typeof value === "number") return !Number.isNaN(value);
  return Boolean(String(value).trim());
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNonNegativeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}
