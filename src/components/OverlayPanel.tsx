import { COPY } from "../constants/copy";
import type { Mode } from "../types/timer";

type Props = {
  motivo: Mode;
  onDispensar: () => void;
};

export function OverlayPanel({ motivo, onDispensar }: Props) {
  const aposFoco = motivo === "foco";

  return (
    <div className="overlay" data-testid="overlay" role="dialog" aria-modal="true">
      <h1 data-testid="overlay-title">
        {aposFoco ? COPY.overlayPararTitulo : COPY.overlayVoltarTitulo}
      </h1>
      <p>{aposFoco ? COPY.overlayPararTexto : COPY.overlayVoltarTexto}</p>
      <button type="button" data-testid="overlay-dismiss" onClick={onDispensar}>
        {COPY.dispensar}
      </button>
    </div>
  );
}
