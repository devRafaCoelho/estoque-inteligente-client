import http from "node:http";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/** Evita ECONNRESET na 1ª request após restart/idle da API (keep-alive morto). */
const apiProxyAgent = new http.Agent({ keepAlive: false });

function apiProxy(target) {
  return {
    target,
    changeOrigin: true,
    agent: apiProxyAgent,
    configure: (proxy) => {
      proxy.on("error", (err, _req, res) => {
        console.error(`[vite] http proxy error: ${_req?.url || ""}`, err);
        if (res && !res.headersSent) {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error:
                "API indisponível no momento. Tente novamente em instantes.",
            }),
          );
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_BASE_URL || "http://localhost:3001";

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.png"],
        manifest: {
          name: "Estoque Inteligente",
          short_name: "Estoque",
          description:
            "Controle de estoque doméstico com entradas inteligentes e financeiro simples.",
          theme_color: "#0f3d28",
          background_color: "#f7f4ef",
          display: "standalone",
          orientation: "portrait-primary",
          start_url: "/",
          lang: "pt-BR",
          icons: [
            {
              src: "favicon.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "favicon.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "favicon.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          navigateFallback: "/index.html",
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    server: {
      port: 5173,
      proxy: {
        "/api": apiProxy(apiTarget),
        "/health": apiProxy(apiTarget),
      },
    },
  };
});
