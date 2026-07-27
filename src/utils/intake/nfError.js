import { ApiError } from "../../services/apiClient";

export const NF_ERROR_KIND = {
  sefazUnavailable: "sefaz_unavailable",
  ufUnsupported: "uf_unsupported",
  stateRequired: "state_required",
  empty: "empty",
  invalid: "invalid",
  network: "network",
  generic: "generic",
};

/**
 * Classifica falha de parse-nf-qr para fallback foto/OCR (F2-5.3).
 * @param {unknown} err
 * @returns {{
 *   kind: string,
 *   message: string,
 *   fallbackPhoto: boolean,
 *   canRetryQr: boolean,
 *   needsState: boolean,
 *   status?: number,
 *   code?: string,
 * }}
 */
export function resolveNfError(err) {
  if (err instanceof TypeError || /failed to fetch|network/i.test(String(err?.message || ""))) {
    return {
      kind: NF_ERROR_KIND.network,
      message: "Sem conexão agora. Verifique a rede ou use a foto do cupom.",
      fallbackPhoto: true,
      canRetryQr: true,
      needsState: false,
    };
  }

  if (!(err instanceof ApiError)) {
    return {
      kind: NF_ERROR_KIND.generic,
      message: "Não foi possível ler a nota. Use a foto do cupom para continuar.",
      fallbackPhoto: true,
      canRetryQr: true,
      needsState: false,
    };
  }

  const status = err.status;
  const details = err.body?.details && typeof err.body.details === "object" ? err.body.details : {};
  const code = details.code || "";
  const raw = String(err.message || "").trim();
  const explicitFallback = details.fallback === "photo";

  if (
    explicitFallback ||
    status === 502 ||
    code === "nf_captcha" ||
    code === "nf_fetch_failed" ||
    code === "nf_collector_failed"
  ) {
    return {
      kind: NF_ERROR_KIND.sefazUnavailable,
      message:
        raw ||
        "Não foi possível consultar a SEFAZ. Tire uma foto do cupom para continuar.",
      fallbackPhoto: true,
      canRetryQr: true,
      needsState: false,
      status,
      code,
    };
  }

  if (code === "nf_state_required" || /defina seu estado/i.test(raw)) {
    return {
      kind: NF_ERROR_KIND.stateRequired,
      message: raw || "Defina seu estado (UF) para consultar a nota.",
      fallbackPhoto: false,
      canRetryQr: true,
      needsState: true,
      status,
      code,
    };
  }

  if (code === "nf_uf_unsupported" || /ainda não lemos notas|sem adapter/i.test(raw)) {
    return {
      kind: NF_ERROR_KIND.ufUnsupported,
      message: raw || "Esta UF ainda não é suportada no QR. Use a foto do cupom.",
      fallbackPhoto: true,
      canRetryQr: false,
      needsState: false,
      status,
      code,
    };
  }

  if (code === "nf_empty_items" || /não encontrei itens|não retornou itens/i.test(raw)) {
    return {
      kind: NF_ERROR_KIND.empty,
      message: raw || "A nota não retornou itens. Use a foto do cupom.",
      fallbackPhoto: true,
      canRetryQr: true,
      needsState: false,
      status,
      code,
    };
  }

  if (status === 400 || code === "nf_invalid_payload") {
    return {
      kind: NF_ERROR_KIND.invalid,
      message: raw || "QR inválido. Escaneie de novo ou use a foto do cupom.",
      fallbackPhoto: true,
      canRetryQr: true,
      needsState: false,
      status,
      code,
    };
  }

  return {
    kind: NF_ERROR_KIND.generic,
    message: raw || "Não foi possível ler a nota. Use a foto do cupom para continuar.",
    fallbackPhoto: true,
    canRetryQr: true,
    needsState: false,
    status,
    code,
  };
}
