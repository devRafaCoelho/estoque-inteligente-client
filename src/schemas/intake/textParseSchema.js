import * as yup from "yup";

export const textParseSchema = yup.object({
  text: yup
    .string()
    .trim()
    .min(3, "Descreva o que comprou (mín. 3 caracteres)")
    .max(4000, "Texto muito longo")
    .required("Descreva o que comprou"),
});
