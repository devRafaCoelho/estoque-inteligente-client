export const PRODUCT_CREATE_CONFIG = {
  paths: {
    list: "/produtos",
    detail: (id) => `/produtos/${id}`,
  },
  defaultValues: {
    name: "",
    category: "grocery",
    quantity: 0,
    unit: "un",
    minQuantity: 1,
    notes: "",
  },
  quantityInputProps: { step: "any", min: 0 },
  minQuantityInputProps: { step: "any", min: 0 },
};
