/**
 * Formata valor monetário (pt-BR / BRL por padrão).
 * @param {unknown} value
 * @param {{ locale?: string, currency?: string }} [options]
 */
export function formatMoney(value, { locale = "pt-BR", currency = "BRL" } = {}) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(value) || 0);
}
