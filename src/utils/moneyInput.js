/**
 * Formatação de valor monetário para input (pt-BR), a partir de número ou string.
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function moneyToDisplay(value) {
  if (value === "" || value == null) return "";
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  return number.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Interpreta digitação (máscara por centavos) e devolve número ou "".
 * @param {string} rawInput
 * @returns {number|""}
 */
export function parseMoneyInput(rawInput) {
  const digits = String(rawInput ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits) / 100;
}
