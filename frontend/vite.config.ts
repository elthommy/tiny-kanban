import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const backendPort = process.env.BACKEND_PORT || "8000";
const frontendPort = parseInt(process.env.FRONTEND_PORT || "5173", 10);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: frontendPort,
    proxy: {
      "/api": `http://localhost:${backendPort}`,
    },
  },
});
