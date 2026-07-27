export const INTAKE_PAGE_CONFIG = {
  defaultValues: { text: "" },
  formMode: "onTouched",
  draftsStatus: "draft",
  draftsLimit: 20,
  defaultMode: "text",
  modes: {
    text: "text",
    photo: "photo",
    manual: "manual",
  },
  paths: {
    dashboard: "/dashboard",
    stockOut: "/baixa",
    products: "/produtos",
    preview: (id) => `/entrada/${id}/preview`,
  },
};
