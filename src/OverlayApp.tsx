import { OverlayPanel } from "./components/OverlayPanel";
import {
  fecharOverlayNativo,
  motivoDoOverlay,
  recadoDoOverlay,
} from "./overlay/tauriOverlay";

export default function OverlayApp() {
  const motivo = motivoDoOverlay();
  const recado = recadoDoOverlay();
  return (
    <OverlayPanel
      motivo={motivo}
      recado={recado}
      onDispensar={() => {
        void fecharOverlayNativo().catch(() => undefined);
      }}
    />
  );
}
