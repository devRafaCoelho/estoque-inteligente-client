/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("push", (event) => {
  const payload = event.data?.json?.() || {};
  const title = payload.title || "Estoque Inteligente";
  const options = {
    body: payload.body || "",
    tag: payload.tag || undefined,
    data: payload.data || { url: "/notificacoes" },
    icon: "/pwa-192.png",
    badge: "/pwa-192.png",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/notificacoes";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const matched = clients.find((client) => "focus" in client);
      if (matched) {
        matched.navigate(url);
        return matched.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
