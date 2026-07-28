export function buildLoginPayload(formData) {
  return {
    email: String(formData.email || "").trim().toLowerCase(),
    password: formData.password,
  };
}

export function buildForgotPasswordPayload(formData) {
  return {
    email: String(formData.email || "").trim().toLowerCase(),
  };
}

export function buildResetPasswordPayload(token, formData) {
  return {
    token,
    password: formData.password,
  };
}

/**
 * Cadastro inicial com nome e sobrenome separados.
 * @param {object} formData
 */
export function buildRegisterPayload(formData) {
  return {
    firstName: String(formData.firstName || "").trim(),
    lastName: String(formData.lastName || "").trim(),
    email: String(formData.email || "").trim().toLowerCase(),
    password: formData.password,
    defaultState: formData.defaultState || null,
  };
}
