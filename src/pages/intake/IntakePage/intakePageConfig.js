export const INTAKE_PAGE_CONFIG = {
  defaultValues: { text: "" },
  formMode: "onTouched",
  draftsStatus: "draft",
  draftsLimit: 20,
  examples: [
    "2kg arroz, 1 leite, 500g feijão",
    "comprei 2 kg de arroz e 1 litro de leite",
    "1 lata de milho, 1 azeite, 3 bananas",
  ],
  paths: {
    dashboard: "/dashboard",
    stockOut: "/baixa",
    preview: (id) => `/entrada/${id}/preview`,
  },
};
