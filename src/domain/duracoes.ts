import {
  FOCO_MS,
  FOCOS_POR_CICLO,
  MINUTOS_MAX,
  MINUTOS_MIN,
  PAUSA_LONGA_MS,
  PAUSA_MS,
} from "../constants/timer";
import type { Duracoes } from "../types/timer";

export const DURACOES_PADRAO: Duracoes = {
  focoMs: FOCO_MS,
  pausaMs: PAUSA_MS,
  pausaLongaMs: PAUSA_LONGA_MS,
};

export function mesclarDuracoes(parcial?: Partial<Duracoes>): Duracoes {
  return { ...DURACOES_PADRAO, ...parcial };
}

export function minutosParaMs(minutos: number): number {
  return minutos * 60 * 1000;
}

export function msParaMinutos(ms: number): number {
  return Math.round(ms / 60_000);
}

export function minutosValidos(valor: number): boolean {
  return Number.isInteger(valor) && valor >= MINUTOS_MIN && valor <= MINUTOS_MAX;
}

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

function buscaTemDuracao(params: URLSearchParams): boolean {
  return (
    params.has("focoMs") || params.has("pausaMs") || params.has("pausaLongaMs")
  );
}

export function parseDuracoesSalvas(raw: string | null): Duracoes | null {
  if (raw == null || raw === "") {
    return null;
  }
  try {
    const dados = JSON.parse(raw) as Partial<Duracoes>;
    const focoMs = Number(dados.focoMs);
    const pausaMs = Number(dados.pausaMs);
    const pausaLongaMs = Number(dados.pausaLongaMs);
    if (
      !Number.isFinite(focoMs) ||
      !Number.isFinite(pausaMs) ||
      !Number.isFinite(pausaLongaMs) ||
      focoMs <= 0 ||
      pausaMs <= 0 ||
      pausaLongaMs <= 0
    ) {
      return null;
    }
    return { focoMs, pausaMs, pausaLongaMs };
  } catch {
    return null;
  }
}

export function duracoesDaBusca(
  search: string,
  salvas: Duracoes | null = null,
): Duracoes {
  const params = new URLSearchParams(
    search.startsWith("?") ? search : `?${search}`,
  );
  const base = salvas ?? DURACOES_PADRAO;
  if (!buscaTemDuracao(params)) {
    return base;
  }
  return {
    focoMs: numeroPositivo(params.get("focoMs"), base.focoMs),
    pausaMs: numeroPositivo(params.get("pausaMs"), base.pausaMs),
    pausaLongaMs: numeroPositivo(params.get("pausaLongaMs"), base.pausaLongaMs),
  };
}

export function focoNoCicloDaBusca(search: string): number {
  const params = new URLSearchParams(
    search.startsWith("?") ? search : `?${search}`,
  );
  const n = Number(params.get("focoNoCiclo"));
  if (!Number.isInteger(n) || n < 1) {
    return 1;
  }
  return Math.min(FOCOS_POR_CICLO, n);
}
