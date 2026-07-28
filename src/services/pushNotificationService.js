import { api } from "./apiClient";
import { NOTIFICATIONS_URL } from "./endpoints";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
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
