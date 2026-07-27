export const INTAKE_PAGE_CONFIG = {
  defaultValues: { text: "" },
  formMode: "onTouched",
  draftsStatus: "draft",
  draftsLimit: 20,
  defaultMode: "text",
  modes: {
    text: "text",
    voice: "voice",
    photo: "photo",
  },
  paths: {
    dashboard: "/dashboard",
    stockOut: "/baixa",
    preview: (id) => `/entrada/${id}/preview`,
  },
};
