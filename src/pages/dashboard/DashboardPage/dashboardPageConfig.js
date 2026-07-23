export const DASHBOARD_PAGE_CONFIG = {
  paths: {
    intake: "/entrada",
    stockOut: "/baixa",
    shopping: "/lista-compras",
    products: "/produtos",
    productCreate: "/produtos/novo",
    finance: "/financeiro",
    notifications: "/notificacoes",
    product: (id) => `/produtos/${id}`,
  },
  locale: "pt-BR",
  currency: "BRL",
  types: {
    consumptionNudge: "consumption_nudge",
  },
  actions: {
    openQuickConsume: "open_quick_consume",
  },
  stockStatus: {
    ok: "ok",
    low: "low",
    out: "out",
  },
};
