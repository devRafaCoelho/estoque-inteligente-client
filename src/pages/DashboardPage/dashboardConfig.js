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
  stockStatus: {
    ok: "ok",
    low: "low",
    out: "out",
  },
};
