import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = String(env.VITE_API_BASE_URL || "https://bagsclub-backend-new-4.onrender.com").replace(/\/+$/, "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true
        }
      }
    }
  };
});
