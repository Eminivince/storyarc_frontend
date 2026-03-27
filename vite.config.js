import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendOrigin = env.VITE_BACKEND_ORIGIN || "http://localhost:4000";

  return {
    // Single React instance for the app + router + query (avoids "Invalid hook call" / useContext null).
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    plugins: [react()],
    // PWA / service worker disabled so deploys are visible immediately without cache busting.
    // Re-enable vite-plugin-pwa here when you want offline + install again.
    server: {
      host: true,
      headers: {
        "Cache-Control": "no-store",
      },
      proxy: {
        "/api": {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          target: backendOrigin,
        },
      },
    },
    preview: {
      port: 4173,
      host: true,
      headers: {
        "Cache-Control": "no-store",
      },
      proxy: {
        "/api": {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          target: backendOrigin,
        },
      },
    },
  };
});
