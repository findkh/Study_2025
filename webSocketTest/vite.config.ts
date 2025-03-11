import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "./config", "");
  console.log(`http://${env.SERVER_URL}:${env.SERVER_PORT}`);
  return {
    envDir: "./config",
    plugins: [react()],
    server: {
      proxy: {
        "/socket": {
          target: `http://${env.SERVER_URL}:${env.SERVER_PORT}`,
          ws: true,
          changeOrigin: true,
        },
      },
    },
    define: {
      global: "globalThis",
    },
  };
});
