export type Mode = "foco" | "pausa";

export type Phase = "idle" | "running" | "paused" | "overlay";

export type Duracoes = {
  focoMs: number;
  pausaMs: number;
};

export type TimerState = {
  mode: Mode;
  phase: Phase;
  remainingMs: number;
  duracoes: Duracoes;
  runningSince: number | null;
  remainingAtRunStart: number | null;
};
