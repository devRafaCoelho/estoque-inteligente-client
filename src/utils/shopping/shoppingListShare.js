/**
 * Helpers para montar URL pública da lista e deep link do WhatsApp.
 * A página pública (/lista-compartilhada/:token) pode ser entregue em card posterior;
 * o link já aponta para esse path.
 */

export const SHARED_LIST_PATH_PREFIX = "/lista-compartilhada";

/**
 * @param {string} token
 * @param {string} [origin] — default: window.location.origin
 */
export function buildSharedListUrl(token, origin = typeof window !== "undefined" ? window.location.origin : "") {
  const base = String(origin || "").replace(/\/$/, "");
  const safeToken = encodeURIComponent(String(token || "").trim());
  return `${base}${SHARED_LIST_PATH_PREFIX}/${safeToken}`;
}

/**
 * @param {string} shareUrl
 */
export function buildWhatsAppShareText(shareUrl) {
  return `Olá! Segue minha lista de compras:\n${shareUrl}`;
}

/**
 * @param {string} shareUrl
 */
export function buildWhatsAppShareUrl(shareUrl) {
  const text = buildWhatsAppShareText(shareUrl);
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Copia texto para a área de transferência (com fallback legado).
 * @param {string} text
 */
export async function copyTextToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  if (typeof document === "undefined") {
    throw new Error("Clipboard indisponível");
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("Não foi possível copiar");
}
