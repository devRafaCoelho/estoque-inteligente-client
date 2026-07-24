import * as yup from "yup";

const requiredNumber = (message) =>
  yup
    .number()
    .transform((value, original) => {
      if (original === "" || original == null) return undefined;
      if (typeof value === "number" && Number.isNaN(value)) return undefined;
      return value;
    })
    .typeError(message)
    .required(message);

export const productSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  category: yup.string().required("Informe a categoria"),
  quantity: requiredNumber("Informe a quantidade").min(0, "Quantidade inválida"),
  unit: yup.string().required("Informe a unidade"),
  minQuantity: requiredNumber("Informe a quantidade mínima").min(
    0,
    "Quantidade mínima inválida",
  ),
  notes: yup.string().nullable(),
});

export const consumeSchema = yup.object({
  quantity: requiredNumber("Informe a quantidade").positive(
    "Informe uma quantidade maior que zero",
  ),
  note: yup.string().nullable(),
});
