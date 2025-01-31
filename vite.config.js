import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt", // Enables "Add to Home Screen"
      manifest: {
        name: "SaveMe",
        short_name: "SaveMe",
        description: "Save Any Kind of Media from any social Media",
        theme_color: "#000",
        background_color: "#000",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
          },
        ],
      },
    }),
  ],
  server: {
    host: "0.0.0.0", // Allow connections from anywhere
    port: 3000,
  },
});
