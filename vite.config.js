import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

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
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:3001",
          changeOrigin: true,
        },
        "/health": {
          target: env.VITE_API_BASE_URL || "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
  };
});
