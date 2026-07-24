/**
 * Recalcula o “notch” dos TextFields outlined (Safari/iOS costuma dessincronizar
 * após fontes, dialogs e autofill).
 */
export function refreshMuiInputNotches() {
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
}
