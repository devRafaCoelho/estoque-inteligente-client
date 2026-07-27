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
 * Número informado (aceita 0). String vazia / null não contam.
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNumberFilled(value) {
  if (value === "" || value == null) return false;
  const n = Number(value);
  return Number.isFinite(n);
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isPositiveNumber(value) {
  if (!isNumberFilled(value)) return false;
  return Number(value) > 0;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isNonNegativeNumber(value) {
  if (!isNumberFilled(value)) return false;
  return Number(value) >= 0;
}

/**
 * Converte input de número opcional (RHF `setValueAs`).
 * String vazia / null → `emptyValue` (default `undefined` para required; use `null` para opcional).
 * @param {unknown} value
 * @param {undefined|null} [emptyValue]
 */
export function parseOptionalNumber(value, emptyValue = undefined) {
  if (value === "" || value == null) return emptyValue;
  return Number(value);
}
