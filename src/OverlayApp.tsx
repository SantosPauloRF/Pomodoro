import { OverlayPanel } from "./components/OverlayPanel";
import { fecharOverlayNativo, motivoDoOverlay } from "./overlay/tauriOverlay";

export default function OverlayApp() {
  const motivo = motivoDoOverlay();
  return (
    <OverlayPanel
      motivo={motivo}
      onDispensar={() => {
        void fecharOverlayNativo().catch(() => undefined);
      }}
    />
  );
}
