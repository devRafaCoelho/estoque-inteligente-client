/**
 * Bloqueia teclas inválidas em <input type="number">
 * (navegadores aceitam "e"/"E" por notação científica).
 *
 * @param {KeyboardEvent} event
 * @param {{ allowNegative?: boolean }} [options]
 */
export function blockInvalidNumberKeyDown(event, { allowNegative = false } = {}) {
  const { key } = event;
  if (key === "e" || key === "E" || key === "+") {
    event.preventDefault();
    return;
  }
  if (key === "-" && !allowNegative) {
    event.preventDefault();
  }
}

/**
 * Impede colar texto com notação científica / sinal inválido.
 *
 * @param {ClipboardEvent} event
 * @param {{ allowNegative?: boolean }} [options]
 */
export function blockInvalidNumberPaste(event, { allowNegative = false } = {}) {
  const text = event.clipboardData?.getData("text") ?? "";
  if (/[eE+]/.test(text) || (!allowNegative && text.includes("-"))) {
    event.preventDefault();
  }
}

/**
 * Props para quantidade >= 0 (aceita decimais).
 * @param {Record<string, unknown>} [extra]
 */
export function nonNegativeDecimalInputProps(extra = {}) {
  return {
    step: "any",
    min: 0,
    inputMode: "decimal",
    onKeyDown: blockInvalidNumberKeyDown,
    onPaste: blockInvalidNumberPaste,
    ...extra,
  };
}

/**
 * Props para inteiros positivos (ex.: dias).
 * @param {Record<string, unknown>} [extra]
 */
export function positiveIntegerInputProps(extra = {}) {
  return {
    step: 1,
    min: 1,
    inputMode: "numeric",
    onKeyDown: blockInvalidNumberKeyDown,
    onPaste: blockInvalidNumberPaste,
    ...extra,
  };
}
