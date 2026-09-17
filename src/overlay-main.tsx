import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import OverlayApp from "./OverlayApp";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <OverlayApp />
  </StrictMode>,
);
