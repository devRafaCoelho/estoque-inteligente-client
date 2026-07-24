export const PRODUCT_CREATE_CONFIG = {
  paths: {
    list: "/produtos",
    detail: (id) => `/produtos/${id}`,
  },
  defaultValues: {
    name: "",
    category: "grocery",
    quantity: "",
    unit: "un",
    minQuantity: 1,
    notes: "",
  },
};
