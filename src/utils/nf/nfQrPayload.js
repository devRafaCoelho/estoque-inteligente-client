import { normalizeAccessKeyDigits, parseAccessKey } from "./nfAccessKey";

const HOST_UF_HINTS = [
  { re: /\.sp\.gov\.br/i, stateCode: "SP" },
  { re: /\.rj\.gov\.br/i, stateCode: "RJ" },
  { re: /\.mg\.gov\.br/i, stateCode: "MG" },
  { re: /\.rs\.gov\.br/i, stateCode: "RS" },
  { re: /\.pr\.gov\.br/i, stateCode: "PR" },
  { re: /\.sc\.gov\.br/i, stateCode: "SC" },
  { re: /\.ba\.gov\.br/i, stateCode: "BA" },
  { re: /\.go\.gov\.br/i, stateCode: "GO" },
  { re: /\.df\.gov\.br/i, stateCode: "DF" },
  { re: /\.pe\.gov\.br/i, stateCode: "PE" },
  { re: /\.ce\.gov\.br/i, stateCode: "CE" },
  { re: /\.es\.gov\.br/i, stateCode: "ES" },
  { re: /\.mt\.gov\.br/i, stateCode: "MT" },
  { re: /\.ms\.gov\.br/i, stateCode: "MS" },
  { re: /fazenda\.am\.gov/i, stateCode: "AM" },
];

/**
 * Extrai sequência de 44 dígitos de um texto (URL, QR bruto ou chave colada).
 * @param {string} raw
 */
export function extractAccessKeyCandidate(raw) {
  const text = String(raw || "").trim();
  if (!text) return "";

  const digitsOnly = normalizeAccessKeyDigits(text);
  if (digitsOnly.length === 44) return digitsOnly;

  // Em URLs NFC-e o param `p` costuma ser CHAVE|versão|...
  try {
    const url = new URL(text);
    const keys = ["chNFe", "chaveAcesso", "chave", "chNfe", "p"];
    for (const key of keys) {
      const value = url.searchParams.get(key);
      if (!value) continue;
      const fromParam = normalizeAccessKeyDigits(value.split("|")[0]);
      if (fromParam.length >= 44) return fromParam.slice(0, 44);
    }
    const fromHref = normalizeAccessKeyDigits(url.href);
    if (fromHref.length >= 44) {
      const match = fromHref.match(/\d{44}/);
      if (match) return match[0];
    }
  } catch {
    // não é URL absoluta — segue busca no texto
  }

  const match = digitsOnly.match(/\d{44}/) || String(raw).match(/\d{44}/);
  return match ? match[0] : "";
}

function inferStateFromHost(raw) {
  try {
    const host = new URL(String(raw).trim()).hostname;
    const hit = HOST_UF_HINTS.find((item) => item.re.test(host));
    return hit?.stateCode || null;
  } catch {
    return null;
  }
}

/**
 * Interpreta conteúdo de QR / colagem (URL ou chave) e valida o payload.
 * @param {string} raw
 * @returns {{
 *   ok: true,
 *   source: 'url' | 'access_key',
 *   rawInput: string,
 *   qrContent: string | null,
 *   accessKey: string,
 *   stateCode: string | null,
 *   stateIbge: string,
 *   model: string,
 *   modelLabel: string,
 *   number: string,
 *   series: string,
 *   emitCnpj: string,
 *   yearMonth: string,
 * } | { ok: false, reason: string }}
 */
export function parseNfQrPayload(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) {
    return { ok: false, reason: "empty" };
  }

  const candidate = extractAccessKeyCandidate(trimmed);
  if (!candidate) {
    return { ok: false, reason: "notFound" };
  }

  const parsed = parseAccessKey(candidate);
  if (!parsed.ok) {
    return { ok: false, reason: parsed.reason };
  }

  let source = "access_key";
  let qrContent = null;
  try {
    const asUrl = new URL(trimmed);
    source = "url";
    qrContent = asUrl.href;
  } catch {
    source = "access_key";
  }

  const hostState = inferStateFromHost(trimmed);
  const stateCode = parsed.stateCode || hostState;

  return {
    ok: true,
    source,
    rawInput: trimmed,
    qrContent,
    accessKey: parsed.accessKey,
    stateCode,
    stateIbge: parsed.stateIbge,
    model: parsed.model,
    modelLabel: parsed.modelLabel,
    number: parsed.number,
    series: parsed.series,
    emitCnpj: parsed.emitCnpj,
    yearMonth: parsed.yearMonth,
  };
}
