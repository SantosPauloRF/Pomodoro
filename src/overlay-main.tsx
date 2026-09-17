import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OverlayPanel } from "./components/OverlayPanel";
import { fecharOverlayNativo, motivoDoOverlay } from "./overlay/tauriOverlay";
import "./index.css";

function OverlayApp() {
  const motivo = motivoDoOverlay();
  return (
    <OverlayPanel
      motivo={motivo}
      onDispensar={() => {
        void fecharOverlayNativo();
      }}
    />
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <OverlayApp />
  </StrictMode>,
);
