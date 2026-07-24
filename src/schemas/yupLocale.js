import { setLocale } from "yup";

/** Evita mensagens técnicas do Yup (ex.: NaN / type cast) em inglês. */
setLocale({
  mixed: {
    default: "Valor inválido",
    required: "Campo obrigatório",
    notType: "Valor inválido",
  },
  string: {
    email: "E-mail inválido",
    min: "Texto muito curto",
    max: "Texto muito longo",
    length: "Valor inválido",
  },
  number: {
    min: "Valor inválido",
    max: "Valor inválido",
    positive: "Informe um valor maior que zero",
    integer: "Informe um número inteiro",
  },
});
