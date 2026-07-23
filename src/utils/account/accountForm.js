import { digitsOnly } from "../address";

export const ACCOUNT_FORM_DEFAULT_VALUES = {
  firstName: "",
  lastName: "",
  phone: "",
  cpf: "",
  zipCode: "",
  street: "",
  streetNumber: "",
  complement: "",
  neighborhood: "",
  city: "",
  defaultState: "",
};

export const CHANGE_PASSWORD_FORM_DEFAULT_VALUES = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

/**
 * @param {object|null|undefined} user
 * @returns {typeof ACCOUNT_FORM_DEFAULT_VALUES}
 */
export function mapUserToAccountFormValues(user) {
  return {
    ...ACCOUNT_FORM_DEFAULT_VALUES,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    cpf: user?.cpf || "",
    zipCode: user?.zipCode || "",
    street: user?.street || "",
    streetNumber: user?.streetNumber || "",
    complement: user?.complement || "",
    neighborhood: user?.neighborhood || "",
    city: user?.city || "",
    defaultState: user?.defaultState || "",
  };
}

/**
 * Monta o body de PATCH /api/users/me a partir do formulário.
 * @param {typeof ACCOUNT_FORM_DEFAULT_VALUES} formData
 */
export function buildUpdateMePayload(formData) {
  return {
    firstName: String(formData.firstName || "").trim(),
    lastName: String(formData.lastName || "").trim(),
    phone: digitsOnly(formData.phone) || null,
    cpf: digitsOnly(formData.cpf) || null,
    zipCode: digitsOnly(formData.zipCode) || null,
    street: String(formData.street || "").trim() || null,
    streetNumber: String(formData.streetNumber || "").trim() || null,
    complement: String(formData.complement || "").trim() || null,
    neighborhood: String(formData.neighborhood || "").trim() || null,
    city: String(formData.city || "").trim() || null,
    defaultState: formData.defaultState || null,
  };
}

/**
 * @param {typeof CHANGE_PASSWORD_FORM_DEFAULT_VALUES} formData
 */
export function buildChangePasswordPayload(formData) {
  return {
    currentPassword: formData.currentPassword || "",
    newPassword: formData.newPassword,
  };
}

/**
 * @param {object} preferences
 */
export function buildUpdatePreferencesPayload(preferences) {
  return {
    notifyLowStock: Boolean(preferences.notifyLowStock),
    notifyOutOfStock: Boolean(preferences.notifyOutOfStock),
    notifyConsumptionNudge: Boolean(preferences.notifyConsumptionNudge),
    consumptionNudgeDays: Number(preferences.consumptionNudgeDays),
  };
}
