import { DURACOES_PADRAO } from "./duracoes";
import type { Duracoes, Mode, TimerState } from "../types/timer";

export function duracaoDoModo(mode: Mode, duracoes: Duracoes): number {
  return mode === "foco" ? duracoes.focoMs : duracoes.pausaMs;
}

export function criarEstadoInicial(
  duracoes: Duracoes = DURACOES_PADRAO,
): TimerState {
  return {
    mode: "foco",
    phase: "idle",
    remainingMs: duracoes.focoMs,
    duracoes,
    runningSince: null,
    remainingAtRunStart: null,
  };
}

export function sincronizar(state: TimerState, agora: number): TimerState {
  if (
    state.phase !== "running" ||
    state.runningSince == null ||
    state.remainingAtRunStart == null
  ) {
    return state;
  }

  const remainingMs = state.remainingAtRunStart - (agora - state.runningSince);
  if (remainingMs <= 0) {
    return {
      ...state,
      phase: "overlay",
      remainingMs: 0,
      runningSince: null,
      remainingAtRunStart: null,
    };
  }

  return { ...state, remainingMs };
}

export function iniciar(state: TimerState, agora: number): TimerState {
  const atual = sincronizar(state, agora);
  if (atual.phase !== "idle" && atual.phase !== "paused") {
    return atual;
  }
  return {
    ...atual,
    phase: "running",
    runningSince: agora,
    remainingAtRunStart: atual.remainingMs,
  };
}

export function pausar(state: TimerState, agora: number): TimerState {
  const atual = sincronizar(state, agora);
  if (atual.phase !== "running") {
    return atual;
  }
  return {
    ...atual,
    phase: "paused",
    runningSince: null,
    remainingAtRunStart: null,
  };
}

export function resetar(state: TimerState): TimerState {
  if (state.phase === "overlay") {
    return state;
  }
  return {
    ...state,
    phase: "idle",
    remainingMs: duracaoDoModo(state.mode, state.duracoes),
    runningSince: null,
    remainingAtRunStart: null,
  };
}

export function dispensarOverlay(state: TimerState): TimerState {
  if (state.phase !== "overlay") {
    return state;
  }
  const proximo: Mode = state.mode === "foco" ? "pausa" : "foco";
  return {
    ...state,
    mode: proximo,
    phase: "idle",
    remainingMs: duracaoDoModo(proximo, state.duracoes),
    runningSince: null,
    remainingAtRunStart: null,
  };
}
