export const STOCK_OUT_PAGE_CONFIG = {
  defaultValues: { text: "" },
  formMode: "onTouched",
  examples: [
    "dê baixa em 1 leite, 200g de queijo",
    "usei 1 azeite e 2 ovos",
    "consumi 500g de arroz",
  ],
  paths: {
    dashboard: "/dashboard",
    intake: "/entrada",
    preview: (id) => `/baixa/${id}/preview`,
  },
};
