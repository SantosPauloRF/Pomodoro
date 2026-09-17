import { COPY } from "../constants/copy";
import { formatarTempo } from "../domain/formatTime";
import type { TimerState } from "../types/timer";

type Props = {
  state: TimerState;
  onIniciar: () => void;
  onPausar: () => void;
  onResetar: () => void;
};

export function TimerScreen({
  state,
  onIniciar,
  onPausar,
  onResetar,
}: Props) {
  const rotuloModo = state.mode === "foco" ? COPY.foco : COPY.pausa;
  const mostrarResetar = state.phase === "running" || state.phase === "paused";

  return (
    <main className="tela">
      <h1>{COPY.tituloApp}</h1>
      <p className="modo" data-testid="mode-label">
        {rotuloModo}
      </p>
      <p className="tempo" data-testid="timer-display" aria-live="polite">
        {formatarTempo(state.remainingMs)}
      </p>
      <div className="acoes">
        {state.phase === "idle" ? (
          <button type="button" onClick={onIniciar}>
            {COPY.iniciar}
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
        {mostrarResetar ? (
          <button type="button" className="secundario" onClick={onResetar}>
            {COPY.resetar}
          </button>
        ) : null}
      </div>
    </main>
  );
}
