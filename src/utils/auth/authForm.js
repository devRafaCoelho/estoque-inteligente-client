export function buildLoginPayload(formData) {
  return {
    email: String(formData.email || "").trim().toLowerCase(),
    password: formData.password,
  };
}

/**
 * Cadastro inicial (um único `name` → firstName no back).
 * @param {object} formData
 */
export function buildRegisterPayload(formData) {
  return {
    name: String(formData.name || "").trim(),
    email: String(formData.email || "").trim().toLowerCase(),
    password: formData.password,
    defaultState: formData.defaultState || null,
  };
}
