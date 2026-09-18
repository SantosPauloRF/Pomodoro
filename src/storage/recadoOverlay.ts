import { normalizarRecadoOverlay } from "../domain/overlayCopy";

const CHAVE = "pomodoro.recadoOverlay";

export function lerRecadoOverlay(): string | null {
  try {
    return normalizarRecadoOverlay(window.localStorage.getItem(CHAVE) ?? "");
  } catch {
    return null;
  }
}

export function gravarRecadoOverlay(recado: string | null): void {
  try {
    if (recado == null) {
      window.localStorage.removeItem(CHAVE);
      return;
    }
    window.localStorage.setItem(CHAVE, recado);
  } catch {
    // Sem storage não bloqueia o timer.
  }
}
