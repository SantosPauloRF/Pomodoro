export type Mode = "foco" | "pausa" | "pausaLonga";

export type Phase = "idle" | "running" | "paused" | "overlay";

export type Duracoes = {
  focoMs: number;
  pausaMs: number;
  pausaLongaMs: number;
};

export type TimerState = {
  mode: Mode;
  phase: Phase;
  remainingMs: number;
  duracoes: Duracoes;
  focoNoCiclo: number;
  runningSince: number | null;
  remainingAtRunStart: number | null;
};
