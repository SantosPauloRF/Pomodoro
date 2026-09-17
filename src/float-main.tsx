import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FloatApp from "./FloatApp";
import "./index.css";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <FloatApp />
  </StrictMode>,
);
