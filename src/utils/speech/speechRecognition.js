/**
 * Junta um trecho de STT ao texto já digitado/editável.
 * @param {unknown} current
 * @param {unknown} chunk
 * @returns {string}
 */
export function appendSpeechTranscript(current, chunk) {
  const base = String(current || "").trimEnd();
  const next = String(chunk || "").trim();
  if (!next) return base;
  if (!base) return next;
  return /[\s,;:(/\-]$/.test(base) ? `${base}${next}` : `${base} ${next}`;
}

/**
 * @returns {typeof window.SpeechRecognition | null}
 */
export function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * @returns {boolean}
 */
export function isSpeechRecognitionSupported() {
  if (typeof window === "undefined") return false;
  if (!window.isSecureContext) return false;
  return Boolean(getSpeechRecognitionConstructor());
}
