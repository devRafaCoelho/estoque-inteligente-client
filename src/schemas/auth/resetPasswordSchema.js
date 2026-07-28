import * as yup from "yup";

export const resetPasswordSchema = yup.object({
  password: yup.string().min(8, "Mínimo 8 caracteres").required("Informe a nova senha"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("Confirme a nova senha"),
});
