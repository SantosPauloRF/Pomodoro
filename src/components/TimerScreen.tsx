import { COPY } from "../constants/copy";
import { FOCOS_POR_CICLO } from "../constants/timer";
import { formatarTempo } from "../domain/formatTime";
import type { Mode, TimerState } from "../types/timer";

type Props = {
  state: TimerState;
  onIniciar: () => void;
  onPausar: () => void;
  onResetar: () => void;
  onPular: () => void;
  onAbrirConfig: () => void;
};

function rotuloModo(mode: Mode): string {
  if (mode === "pausaLonga") {
    return COPY.pausaLonga;
  }
  return mode === "foco" ? COPY.foco : COPY.pausa;
}

function rotuloIniciar(mode: Mode): string {
  if (mode === "pausaLonga") {
    return COPY.iniciarPausaLonga;
  }
  if (mode === "pausa") {
    return COPY.iniciarPausa;
  }
  return COPY.iniciarFoco;
}

export function TimerScreen({
  state,
  onIniciar,
  onPausar,
  onResetar,
  onPular,
  onAbrirConfig,
}: Props) {
  const mostrarResetar = state.phase === "running" || state.phase === "paused";

  return (
    <main className="tela">
      <div className="topo">
        <h1>{COPY.tituloApp}</h1>
        <button
          type="button"
          className="secundario"
          onClick={onAbrirConfig}
        >
          {COPY.configuracoes}
        </button>
      </div>
      <p className="modo" data-testid="mode-label">
        {rotuloModo(state.mode)}
      </p>
      {state.mode === "foco" ? (
        <p className="ciclo" data-testid="cycle-label">
          {state.focoNoCiclo} de {FOCOS_POR_CICLO}
        </p>
      ) : null}
      <p className="tempo" data-testid="timer-display" aria-live="polite">
        {formatarTempo(state.remainingMs)}
      </p>
      <div className="acoes">
        {state.phase === "idle" ? (
          <button type="button" onClick={onIniciar}>
            {rotuloIniciar(state.mode)}
          </button>
        ) : null}
        {state.phase === "running" ? (
          <button type="button" onClick={onPausar}>
            {COPY.pausar}
          </button>
        ) : null}
        {state.phase === "paused" ? (
          <button type="button" onClick={onIniciar}>
            {COPY.retomar}
          </button>
        ) : null}
        {state.phase !== "overlay" ? (
          <button
            type="button"
            className="secundario"
            data-testid="skip"
            onClick={onPular}
          >
            {COPY.pular}
          </button>
        ) : null}
        {mostrarResetar ? (
          <button type="button" className="secundario" onClick={onResetar}>
            {COPY.resetar}
          </button>
        ) : null}
      </div>
    </main>
  );
}
