import type { Mode } from "../types/timer";

export function corDoModo(mode: Mode): string {
  if (mode === "pausaLonga") {
    return "var(--ouro)";
  }
  if (mode === "pausa") {
    return "var(--verde)";
  }
  return "var(--coral)";
}
