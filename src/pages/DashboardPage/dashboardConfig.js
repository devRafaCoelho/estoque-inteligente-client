export const DASHBOARD_CONFIG = {
  paths: {
    intake: "/entrada",
    stockOut: "/baixa",
    shopping: "/lista-compras",
    products: "/produtos",
    notifications: "/notificacoes",
    product: (id) => `/produtos/${id}`,
  },
  locale: "pt-BR",
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
