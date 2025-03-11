import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket": {
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: true, // WebSocket 프록시 활성화
      },
    },
  },
  define: {
    global: "globalThis",
  },
});
