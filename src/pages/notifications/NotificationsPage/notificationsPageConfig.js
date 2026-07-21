export const NOTIFICATIONS_PAGE_CONFIG = {
  defaultFilter: "all",
  filters: {
    all: "all",
    unread: "unread",
  },
  listLimit: 50,
  locale: "pt-BR",
  types: {
    consumptionNudge: "consumption_nudge",
  },
  actions: {
    openQuickConsume: "open_quick_consume",
    openProduct: "open_product",
  },
  productPath: (id) => `/produtos/${id}`,
  stockOutPath: "/baixa",
};
