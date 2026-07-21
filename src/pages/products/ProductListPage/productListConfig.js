export const PRODUCT_LIST_CONFIG = {
  searchDebounceMs: 300,
  paths: {
    intake: "/entrada",
    create: "/produtos/novo",
  },
  statusFilters: [
    { value: "", labelKey: "filterAll" },
    { value: "ok", labelKey: "filterOk" },
    { value: "low", labelKey: "filterLow" },
    { value: "out", labelKey: "filterOut" },
  ],
};
