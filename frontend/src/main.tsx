import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";

declare const __BACKEND_PORT__: string;
declare const __FRONTEND_PORT__: string;

console.log(
  `[startup] frontend port: ${__FRONTEND_PORT__}, backend port: ${__BACKEND_PORT__} (API proxy → http://localhost:${__BACKEND_PORT__})`,
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
