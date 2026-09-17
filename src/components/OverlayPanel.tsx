import { useLayoutEffect } from "react";
import { COPY } from "../constants/copy";
import type { Mode } from "../types/timer";

type Props = {
  motivo: Mode;
  onDispensar: () => void;
};

function titulo(motivo: Mode): string {
  return motivo === "foco" ? COPY.overlayPararTitulo : COPY.overlayVoltarTitulo;
}

function texto(motivo: Mode): string {
  if (motivo === "foco") {
    return COPY.overlayPararTexto;
  }
  if (motivo === "pausaLonga") {
    return COPY.overlayPausaLongaTexto;
  }
  return COPY.overlayVoltarTexto;
}

export function OverlayPanel({ motivo, onDispensar }: Props) {
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
        <h1 data-testid="overlay-title">{titulo(motivo)}</h1>
        <p>{texto(motivo)}</p>
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
