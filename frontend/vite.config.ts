import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "ResQMesh",
        short_name: "ResQMesh",
        description:
          "Offline emergency evacuation communication system",
        theme_color: "#eef2f7",
        background_color: "#eef2f7",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/pwa-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp}",
        ],
      },

      devOptions: {
        enabled: true,
      },
    }),
  ],

  server: {
    host: "0.0.0.0",
    port: 5175,
    strictPort: true,
  },
});