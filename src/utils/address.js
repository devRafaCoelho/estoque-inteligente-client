/**
 * Remove formatação, mantendo só dígitos.
 * @param {string|null|undefined} value
 * @returns {string}
 */
export function digitsOnly(value) {
  return String(value ?? "").replace(/\D/g, "");
}

/**
 * Formata CEP: 01310-100
 * @param {string|null|undefined} value
 */
export function formatZipCode(value) {
  const digits = digitsOnly(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Formata telefone BR (fix ou celular).
 * @param {string|null|undefined} value
 */
export function formatPhone(value) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Formata CPF: 000.000.000-00
 * @param {string|null|undefined} value
 */
export function formatCpf(value) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

/**
 * Busca endereço na ViaCEP.
 * @param {string} zipCode
 * @returns {Promise<{
 *   zipCode: string,
 *   street: string,
 *   complement: string,
 *   neighborhood: string,
 *   city: string,
 *   defaultState: string,
 * }|null>}
 */
export async function lookupAddressByZipCode(zipCode) {
  const cep = digitsOnly(zipCode);
  if (cep.length !== 8) return null;

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!response.ok) throw new Error("Falha ao consultar CEP");
  const data = await response.json();
  if (data?.erro) return null;

  return {
    zipCode: cep,
    street: data.logradouro || "",
    complement: data.complemento || "",
    neighborhood: data.bairro || "",
    city: data.localidade || "",
    defaultState: data.uf || "",
  };
}
