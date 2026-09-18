import { COPY } from "../constants/copy";
import type { Mode } from "../types/timer";

export const RECADO_OVERLAY_MAX = 160;

export function tituloOverlayPadrao(mode: Mode): string {
  return mode === "foco" ? COPY.overlayPararTitulo : COPY.overlayVoltarTitulo;
}

export function textoOverlayPadrao(mode: Mode): string {
  if (mode === "foco") {
    return COPY.overlayPararTexto;
  }
  if (mode === "pausaLonga") {
    return COPY.overlayPausaLongaTexto;
  }
  return COPY.overlayVoltarTexto;
}

export function normalizarRecadoOverlay(raw: string): string | null {
  const texto = raw.trim();
  if (texto === "") {
    return null;
  }
  return texto.slice(0, RECADO_OVERLAY_MAX);
}

export function tituloDoOverlay(mode: Mode, recado: string | null): string {
  return recado ?? tituloOverlayPadrao(mode);
}
