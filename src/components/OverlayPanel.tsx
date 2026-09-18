import { useLayoutEffect } from "react";
import { COPY } from "../constants/copy";
import { textoOverlayPadrao, tituloDoOverlay } from "../domain/overlayCopy";
import type { Mode } from "../types/timer";

type Props = {
  motivo: Mode;
  recado?: string | null;
  onDispensar: () => void;
};

export function OverlayPanel({ motivo, recado = null, onDispensar }: Props) {
  useLayoutEffect(() => {
    document.documentElement.classList.add("janela-overlay");
    document.body.classList.add("janela-overlay");
    function onKey(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        onDispensar();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("janela-overlay");
      document.body.classList.remove("janela-overlay");
      window.removeEventListener("keydown", onKey);
    };
  }, [onDispensar]);

  return (
    <div className="overlay" data-testid="overlay" role="dialog" aria-modal="true">
      <div className="overlay-caixa">
        <h1 data-testid="overlay-title">{tituloDoOverlay(motivo, recado)}</h1>
        <p>{textoOverlayPadrao(motivo)}</p>
        <button
          type="button"
          className="botao-principal"
          data-testid="overlay-dismiss"
          onClick={onDispensar}
        >
          {COPY.dispensar}
        </button>
      </div>
    </div>
  );
}
