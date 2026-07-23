import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  category: yup.string().required(),
  quantity: yup.number().min(0).required(),
  unit: yup.string().required(),
  minQuantity: yup.number().min(0).required(),
  notes: yup.string().nullable(),
});

export const consumeSchema = yup.object({
  quantity: yup
    .number()
    .positive("Informe uma quantidade")
    .required("Informe a quantidade"),
  note: yup.string().nullable(),
});
