export const NOTIFICATIONS_PAGE_CONFIG = {
  defaultFilter: "all",
  filters: {
    all: "all",
    unread: "unread",
  },
  listLimit: 50,
  locale: "pt-BR",
  productPath: (id) => `/produtos/${id}`,
};
