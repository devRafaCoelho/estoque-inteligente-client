import * as yup from "yup";

export const forgotPasswordSchema = yup.object({
  email: yup.string().email("E-mail inválido").required("Informe o e-mail"),
});
