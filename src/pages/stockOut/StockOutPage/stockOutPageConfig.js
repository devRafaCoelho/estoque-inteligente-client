export const STOCK_OUT_PAGE_CONFIG = {
  defaultValues: { text: "" },
  formMode: "onTouched",
  draftsStatus: "draft",
  draftsLimit: 20,
  paths: {
    dashboard: "/dashboard",
    intake: "/entrada",
    preview: (id) => `/baixa/${id}/preview`,
  },
};
