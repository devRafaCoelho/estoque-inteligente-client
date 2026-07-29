export const SHARED_SHOPPING_LIST_PAGE_COPY = {
  brand: "Estoque Inteligente",
  loadError: "Não foi possível abrir esta lista",
  invalidLink: "Link inválido, expirado ou revogado",
  gone: "Esta lista não está mais ativa",
  empty: "Lista vazia",
  stats: (pending, checked) => `${pending} pendente(s) · ${checked} marcado(s)`,
  spendLabel: "Estimativa",
  spendValue: (totalLabel) => `Estimativa: ${totalLabel}`,
  spendValuePartial: (totalLabel) => `Estimativa: ${totalLabel} · parcial`,
  footerHint: "Lista compartilhada · somente leitura",
};
