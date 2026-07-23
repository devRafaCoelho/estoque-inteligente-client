import * as yup from "yup";

export const accountSchema = yup.object({
  firstName: yup.string().trim().min(2, "Nome muito curto").required("Informe o nome"),
  lastName: yup.string().trim().min(1, "Informe o sobrenome").required("Informe o sobrenome"),
  phone: yup
    .string()
    .transform((value) => String(value || "").replace(/\D/g, ""))
    .test(
      "phone",
      "Telefone inválido",
      (value) => !value || (value.length >= 10 && value.length <= 13),
    )
    .nullable(),
  cpf: yup
    .string()
    .transform((value) => String(value || "").replace(/\D/g, ""))
    .test("cpf", "CPF deve ter 11 dígitos", (value) => !value || value.length === 11)
    .nullable(),
  zipCode: yup
    .string()
    .transform((value) => String(value || "").replace(/\D/g, ""))
    .test("zip", "CEP deve ter 8 dígitos", (value) => !value || value.length === 8)
    .nullable(),
  street: yup.string().trim().max(255).nullable(),
  streetNumber: yup.string().trim().max(20).nullable(),
  complement: yup.string().trim().max(120).nullable(),
  neighborhood: yup.string().trim().max(120).nullable(),
  city: yup.string().trim().max(120).nullable(),
  defaultState: yup.string().length(2).nullable(),
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().nullable(),
  newPassword: yup.string().min(8, "Mínimo 8 caracteres").required("Informe a nova senha"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "As senhas não coincidem")
    .required("Confirme a senha"),
});
