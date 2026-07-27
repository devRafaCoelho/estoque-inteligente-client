export const DASHBOARD_PAGE_CONFIG = {
  paths: {
    chat: "/chat",
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
  stockStatus: {
    ok: "ok",
    low: "low",
    out: "out",
  },
};
