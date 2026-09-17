const CHAVE = "pomodoro.duracoes";

import type { Duracoes } from "../types/timer";
import { parseDuracoesSalvas } from "../domain/duracoes";

export function lerDuracoesLocal(): Duracoes | null {
  try {
    return parseDuracoesSalvas(window.localStorage.getItem(CHAVE));
  } catch {
    return null;
  }
}

export function gravarDuracoesLocal(duracoes: Duracoes): void {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(duracoes));
  } catch {
    // Sem storage não bloqueia o timer.
  }
}
