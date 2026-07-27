/** Códigos IBGE (cUF) → sigla da UF. */
export const IBGE_UF_BY_CODE = {
  "11": "RO",
  "12": "AC",
  "13": "AM",
  "14": "RR",
  "15": "PA",
  "16": "AP",
  "17": "TO",
  "21": "MA",
  "22": "PI",
  "23": "CE",
  "24": "RN",
  "25": "PB",
  "26": "PE",
  "27": "AL",
  "28": "SE",
  "29": "BA",
  "31": "MG",
  "32": "ES",
  "33": "RJ",
  "35": "SP",
  "41": "PR",
  "42": "SC",
  "43": "RS",
  "50": "MS",
  "51": "MT",
  "52": "GO",
  "53": "DF",
};

export const NF_MODEL_LABELS = {
  "55": "NF-e",
  "65": "NFC-e",
};

/** Remove espaços, pontuação e deixa só dígitos. */
export function normalizeAccessKeyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

/**
 * DV módulo 11 (pesos 2–9 da direita para a esquerda) sobre os 43 primeiros dígitos.
 * @param {string} first43
 */
export function computeAccessKeyCheckDigit(first43) {
  const digits = String(first43 || "");
  if (!/^\d{43}$/.test(digits)) return null;
  let sum = 0;
  let weight = 2;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    sum += Number(digits[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const remainder = sum % 11;
  if (remainder === 0 || remainder === 1) return 0;
  return 11 - remainder;
}

/**
 * Valida e decompõe a chave de acesso (44 dígitos).
 * @param {string} raw
 * @returns {{
 *   ok: true,
 *   accessKey: string,
 *   stateIbge: string,
 *   stateCode: string | null,
 *   yearMonth: string,
 *   emitCnpj: string,
 *   model: string,
 *   modelLabel: string,
 *   series: string,
 *   number: string,
 *   emissionType: string,
 *   numericCode: string,
 *   checkDigit: string,
 * } | { ok: false, reason: string }}
 */
export function parseAccessKey(raw) {
  const accessKey = normalizeAccessKeyDigits(raw);
  if (accessKey.length !== 44) {
    return { ok: false, reason: "length" };
  }
  if (!/^\d{44}$/.test(accessKey)) {
    return { ok: false, reason: "digits" };
  }

  const expected = computeAccessKeyCheckDigit(accessKey.slice(0, 43));
  const checkDigit = Number(accessKey[43]);
  if (expected == null || checkDigit !== expected) {
    return { ok: false, reason: "checkDigit" };
  }

  const stateIbge = accessKey.slice(0, 2);
  const stateCode = IBGE_UF_BY_CODE[stateIbge] || null;
  if (!stateCode) {
    return { ok: false, reason: "state" };
  }

  const model = accessKey.slice(20, 22);
  if (model !== "55" && model !== "65") {
    return { ok: false, reason: "model" };
  }

  return {
    ok: true,
    accessKey,
    stateIbge,
    stateCode,
    yearMonth: accessKey.slice(2, 6),
    emitCnpj: accessKey.slice(6, 20),
    model,
    modelLabel: NF_MODEL_LABELS[model] || model,
    series: accessKey.slice(22, 25),
    number: String(Number(accessKey.slice(25, 34))),
    emissionType: accessKey.slice(34, 35),
    numericCode: accessKey.slice(35, 43),
    checkDigit: accessKey.slice(43),
  };
}
