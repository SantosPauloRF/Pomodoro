import { FOCOS_POR_CICLO } from "../constants/timer";
import type { Duracoes, Mode, TimerState } from "../types/timer";
import { mesclarDuracoes } from "./duracoes";

export function duracaoDoModo(mode: Mode, duracoes: Duracoes): number {
  if (mode === "foco") {
    return duracoes.focoMs;
  }
  if (mode === "pausaLonga") {
    return duracoes.pausaLongaMs;
  }
  return duracoes.pausaMs;
}

export function criarEstadoInicial(
  duracoes?: Partial<Duracoes>,
  focoNoCiclo = 1,
): TimerState {
  const d = mesclarDuracoes(duracoes);
  const ciclo = Math.min(FOCOS_POR_CICLO, Math.max(1, focoNoCiclo));
  return {
    mode: "foco",
    phase: "idle",
    remainingMs: d.focoMs,
    duracoes: d,
    focoNoCiclo: ciclo,
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

export function aplicarDuracoes(
  state: TimerState,
  duracoes: Duracoes,
): TimerState {
  const proximo = { ...state, duracoes };
  if (proximo.phase !== "idle") {
    return proximo;
  }
  return {
    ...proximo,
    remainingMs: duracaoDoModo(proximo.mode, duracoes),
  };
}

function proximoAposOverlay(state: TimerState): Pick<
  TimerState,
  "mode" | "focoNoCiclo"
> {
  if (state.mode === "foco") {
    if (state.focoNoCiclo >= FOCOS_POR_CICLO) {
      return { mode: "pausaLonga", focoNoCiclo: state.focoNoCiclo };
    }
    return { mode: "pausa", focoNoCiclo: state.focoNoCiclo };
  }
  if (state.mode === "pausaLonga") {
    return { mode: "foco", focoNoCiclo: 1 };
  }
  return {
    mode: "foco",
    focoNoCiclo: Math.min(FOCOS_POR_CICLO, state.focoNoCiclo + 1),
  };
}

function irParaProximoModo(state: TimerState): TimerState {
  const proximo = proximoAposOverlay(state);
  return {
    ...state,
    mode: proximo.mode,
    focoNoCiclo: proximo.focoNoCiclo,
    phase: "idle",
    remainingMs: duracaoDoModo(proximo.mode, state.duracoes),
    runningSince: null,
    remainingAtRunStart: null,
  };
}

export function dispensarOverlay(state: TimerState): TimerState {
  if (state.phase !== "overlay") {
    return state;
  }
  return irParaProximoModo(state);
}

export function pular(state: TimerState): TimerState {
  if (state.phase === "overlay") {
    return state;
  }
  return irParaProximoModo(state);
}
