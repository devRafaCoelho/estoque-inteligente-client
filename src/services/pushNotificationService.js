import { api } from "./apiClient";
import { NOTIFICATIONS_URL } from "./endpoints";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

/**
 * iPhone/iPad (inclui iPadOS com UA desktop).
 */
export function isIosDevice() {
  if (typeof navigator === "undefined" || typeof window === "undefined") {
    return false;
  }
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  // iPadOS 13+ reporta-se como Mac com touch
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}

/**
 * PWA aberta da Tela de Início (standalone).
 */
export function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const mediaStandalone =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)").matches;
  // iOS Safari legado
  const iosStandalone = Boolean(window.navigator?.standalone);
  return mediaStandalone || iosStandalone;
}

/**
 * No iOS/iPadOS, Web Push só funciona com o app instalado na Tela de Início (16.4+).
 * Dentro do Safari em aba, a API pode existir, mas a ativação falha ou fica inconsistente.
 */
export function requiresIosHomeScreenForPush() {
  return isIosDevice() && !isStandaloneDisplay();
}

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * @returns {'ok'|'unsupported'|'ios_install_required'|'denied'}
 */
export function getPushBlockReason() {
  if (!isPushSupported()) return "unsupported";
  if (requiresIosHomeScreenForPush()) return "ios_install_required";
  if (typeof Notification !== "undefined" && Notification.permission === "denied") {
    return "denied";
  }
  return "ok";
}

export function canEnablePushOnThisDevice() {
  return getPushBlockReason() === "ok";
}

/**
 * Aguarda o service worker ficar pronto, com timeout para não travar o switch em dev.
 * @param {number} [timeoutMs=8000]
 */
export async function getServiceWorkerRegistration(timeoutMs = 8000) {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service worker indisponível neste navegador");
  }

  const existing = await navigator.serviceWorker.getRegistration();
  if (existing?.active) return existing;

  let timeoutId;
  try {
    return await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new Error(
              "Service worker ainda não está ativo. Recarregue a página e tente de novo.",
            ),
          );
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function getPushConfig() {
  return api.get(`${NOTIFICATIONS_URL}/push/config`);
}

export async function subscribePush(registration, vapidPublicKey) {
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    }));

  return api.post(`${NOTIFICATIONS_URL}/push/subscribe`, subscription.toJSON());
}

export async function unsubscribePush(registration) {
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    return api.post(`${NOTIFICATIONS_URL}/push/unsubscribe`, {
      endpoint: "https://example.invalid/no-subscription",
    });
  }
  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();
  return api.post(`${NOTIFICATIONS_URL}/push/unsubscribe`, { endpoint });
}
