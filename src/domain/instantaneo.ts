import type { Mode, Phase, TimerState } from "../types/timer";
import { duracaoDoModo } from "./timer";

export type InstantaneoFlutuante = {
  remainingMs: number;
  totalMs: number;
  phase: Phase;
  mode: Mode;
  runningSince: number | null;
  remainingAtRunStart: number | null;
};

function ehModo(valor: unknown): valor is Mode {
  return valor === "foco" || valor === "pausa" || valor === "pausaLonga";
}

function ehFase(valor: unknown): valor is Phase {
  return (
    valor === "idle" ||
    valor === "running" ||
    valor === "paused" ||
    valor === "overlay"
  );
}

function numeroOuNulo(valor: unknown): number | null {
  if (valor == null) {
    return null;
  }
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return null;
  }
  return valor;
}

export function instantaneoDeEstado(state: TimerState): InstantaneoFlutuante {
  return {
    remainingMs: state.remainingMs,
    totalMs: duracaoDoModo(state.mode, state.duracoes),
    phase: state.phase,
    mode: state.mode,
    runningSince: state.runningSince,
    remainingAtRunStart: state.remainingAtRunStart,
  };
}

export function remainingDoInstantaneo(
  snap: InstantaneoFlutuante,
  agora: number,
): number {
  if (
    snap.phase !== "running" ||
    snap.runningSince == null ||
    snap.remainingAtRunStart == null
  ) {
    return Math.max(0, snap.remainingMs);
  }
  return Math.max(0, snap.remainingAtRunStart - (agora - snap.runningSince));
}

export function instantaneoDeDados(dados: unknown): InstantaneoFlutuante | null {
  if (typeof dados !== "object" || dados == null) {
    return null;
  }
  const obj = dados as Record<string, unknown>;
  if (!ehModo(obj.mode) || !ehFase(obj.phase)) {
    return null;
  }
  if (
    typeof obj.remainingMs !== "number" ||
    !Number.isFinite(obj.remainingMs) ||
    typeof obj.totalMs !== "number" ||
    !Number.isFinite(obj.totalMs)
  ) {
    return null;
  }
  return {
    remainingMs: obj.remainingMs,
    totalMs: obj.totalMs,
    phase: obj.phase,
    mode: obj.mode,
    runningSince: numeroOuNulo(obj.runningSince),
    remainingAtRunStart: numeroOuNulo(obj.remainingAtRunStart),
  };
}

export function parseInstantaneo(raw: string | null): InstantaneoFlutuante | null {
  if (raw == null || raw === "") {
    return null;
  }
  try {
    return instantaneoDeDados(JSON.parse(raw));
  } catch {
    return null;
  }
}
