import { ApiError } from "../../services/apiClient";

export const OCR_ERROR_KIND = {
  illegible: "illegible",
  empty: "empty",
  rateLimit: "rate_limit",
  unavailable: "unavailable",
  timeout: "timeout",
  network: "network",
  invalid: "invalid",
  generic: "generic",
};

/**
 * Classifica falha de parse-image para UX de retry (F2-4.5).
 * @param {unknown} err
 * @returns {{ kind: string, message: string, canRetry: boolean, status?: number }}
 */
export function resolveOcrError(err) {
  if (err?.name === "AbortError" || err?.code === "TIMEOUT") {
    return {
      kind: OCR_ERROR_KIND.timeout,
      message: "A leitura demorou demais. Tente de novo ou use texto.",
      canRetry: true,
      status: 408,
    };
  }

  if (err instanceof TypeError || /failed to fetch|network/i.test(String(err?.message || ""))) {
    return {
      kind: OCR_ERROR_KIND.network,
      message: "Sem conexão agora. Verifique a rede e tente de novo.",
      canRetry: true,
    };
  }

  if (!(err instanceof ApiError)) {
    return {
      kind: OCR_ERROR_KIND.generic,
      message: "Não foi possível ler o cupom. Tente outra foto ou use texto.",
      canRetry: true,
    };
  }

  const status = err.status;
  const raw = String(err.message || "").trim();
  const lower = raw.toLowerCase();

  if (status === 429) {
    return {
      kind: OCR_ERROR_KIND.rateLimit,
      message: raw || "Limite diário de leituras atingido. Tente amanhã ou use texto.",
      canRetry: false,
      status,
    };
  }

  if (status === 503) {
    return {
      kind: OCR_ERROR_KIND.unavailable,
      message: raw || "Leitura por foto indisponível no momento. Use texto.",
      canRetry: false,
      status,
    };
  }

  if (status === 413 || /muito grande/i.test(lower)) {
    return {
      kind: OCR_ERROR_KIND.invalid,
      message: raw || "Imagem muito grande. Escolha outra foto.",
      canRetry: false,
      status,
    };
  }

  if (
    /não encontrei itens|nenhum item|sem itens/i.test(lower) ||
    /não entendi o cupom/i.test(lower)
  ) {
    return {
      kind: OCR_ERROR_KIND.empty,
      message: raw || "Não encontrei itens nesta foto. Tire outra mais nítida ou use texto.",
      canRetry: true,
      status,
    };
  }

  if (/ilegív|nítida|outra (imagem|foto)|não consegui (ler|estruturar)/i.test(lower)) {
    return {
      kind: OCR_ERROR_KIND.illegible,
      message: raw || "Cupom ilegível. Tire outra foto (mais perto e com boa luz) ou use texto.",
      canRetry: true,
      status,
    };
  }

  if (status === 400 || status === 422) {
    return {
      kind: OCR_ERROR_KIND.illegible,
      message: raw || "Não deu para ler esta foto. Tente de novo ou use texto.",
      canRetry: true,
      status,
    };
  }

  return {
    kind: OCR_ERROR_KIND.generic,
    message: raw || "Não foi possível ler o cupom. Tente de novo ou use texto.",
    canRetry: true,
    status,
  };
}

/**
 * @template T
 * @param {Promise<T>} promise
 * @param {number} timeoutMs
 * @returns {Promise<T>}
 */
export function withTimeout(promise, timeoutMs) {
  if (!timeoutMs || timeoutMs <= 0) return promise;

  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error("TIMEOUT");
      err.code = "TIMEOUT";
      err.name = "AbortError";
      reject(err);
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}
