import * as yup from "yup";

export const registerDadosSchema = yup.object({
  firstName: yup.string().trim().min(2, "Nome muito curto").required("Informe o nome"),
  lastName: yup.string().trim().min(1, "Informe o sobrenome").required("Informe o sobrenome"),
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

export const registerSchemas = [
  registerDadosSchema,
  registerAcessoSchema,
  yup.object(),
];

export const registerSchema = registerDadosSchema.concat(registerAcessoSchema);
