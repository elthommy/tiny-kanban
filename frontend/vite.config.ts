import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  const backendPort = env.BACKEND_PORT || "8000";
  const frontendPort = parseInt(env.FRONTEND_PORT || "5173", 10);

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: frontendPort,
      proxy: {
        "/api": `http://localhost:${backendPort}`,
      },
    },
  };
});
