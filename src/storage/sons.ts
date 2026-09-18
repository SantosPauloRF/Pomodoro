import type { SonsConfig } from "../domain/sons";
import { parseSonsSalvos } from "../domain/sons";

const CHAVE = "pomodoro.sons";

export function lerSonsLocal(): SonsConfig | null {
  try {
    return parseSonsSalvos(window.localStorage.getItem(CHAVE));
  } catch {
    return null;
  }
}

export function gravarSonsLocal(sons: SonsConfig): void {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(sons));
  } catch {
    // Sem storage não bloqueia o timer.
  }
}
