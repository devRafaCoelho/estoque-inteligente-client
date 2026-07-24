export const FINANCE_PAGE_CONFIG = {
  locale: "pt-BR",
  currency: "BRL",
  monthLabels: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
};

/** Meses do ano corrente até o mês atual (1–12). */
export function getAvailableFinanceMonths(now = new Date()) {
  const year = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return Array.from({ length: currentMonth }, (_, index) => {
    const month = index + 1;
    return {
      year,
      month,
      label: FINANCE_PAGE_CONFIG.monthLabels[index],
      name: FINANCE_PAGE_CONFIG.monthNames[index],
    };
  });
}
