import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("E-mail inválido").required("Informe o e-mail"),
  password: yup.string().required("Informe a senha"),
});

export const registerDadosSchema = yup.object({
  name: yup.string().trim().min(2, "Nome muito curto").required("Informe o nome"),
  defaultState: yup
    .string()
    .length(2, "Selecione a UF")
    .required("Selecione a UF"),
});

export const registerAcessoSchema = yup.object({
  email: yup.string().email("E-mail inválido").required("Informe o e-mail"),
  password: yup.string().min(8, "Mínimo 8 caracteres").required("Informe a senha"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não coincidem")
    .required("Confirme a senha"),
});

export const registerSchemas = [registerDadosSchema, registerAcessoSchema, yup.object()];

export const registerSchema = registerDadosSchema.concat(registerAcessoSchema);

export const productSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  category: yup.string().required(),
  quantity: yup.number().min(0).required(),
  unit: yup.string().required(),
  minQuantity: yup.number().min(0).required(),
  notes: yup.string().nullable(),
});

export const consumeSchema = yup.object({
  quantity: yup.number().positive("Informe uma quantidade").required("Informe a quantidade"),
  note: yup.string().nullable(),
});

export const accountSchema = yup.object({
  name: yup.string().min(2).required("Informe o nome"),
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

export const intakeParseSchema = yup.object({
  text: yup
    .string()
    .trim()
    .min(3, "Descreva o que comprou (mín. 3 caracteres)")
    .max(4000, "Texto muito longo")
    .required("Descreva o que comprou"),
});
