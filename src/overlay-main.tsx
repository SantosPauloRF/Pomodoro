import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OverlayApp from "./OverlayApp";
import "./index.css";

document.documentElement.classList.add("janela-overlay");
document.body.classList.add("janela-overlay");

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <OverlayApp />
  </StrictMode>,
);
