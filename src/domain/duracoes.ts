import { FOCO_MS, PAUSA_MS } from "../constants/timer";
import type { Duracoes } from "../types/timer";

export const DURACOES_PADRAO: Duracoes = {
  focoMs: FOCO_MS,
  pausaMs: PAUSA_MS,
};

function numeroPositivo(valor: string | null, padrao: number): number {
  if (valor == null || valor === "") {
    return padrao;
  }
  const n = Number(valor);
  if (!Number.isFinite(n) || n <= 0) {
    return padrao;
  }
  return n;
}

/** Hook de teste/dev via query string (`?focoMs=2000&pausaMs=2000`). */
export function duracoesDaBusca(search: string): Duracoes {
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  return {
    focoMs: numeroPositivo(params.get("focoMs"), FOCO_MS),
    pausaMs: numeroPositivo(params.get("pausaMs"), PAUSA_MS),
  };
}
