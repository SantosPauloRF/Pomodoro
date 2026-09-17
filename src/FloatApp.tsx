import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import iconePomodoro from "./assets/icone-pomodoro.png";
import { AnelTempo } from "./components/AnelTempo";
import { IconePausa, IconePlay } from "./components/Icones";
import { COPY } from "./constants/copy";
import { instantaneoDeEstado, remainingDoInstantaneo } from "./domain/instantaneo";
import { progressoRestante } from "./domain/progresso";
import { formatarRelogioFlutuante } from "./domain/relogio";
import { corDoModo } from "./domain/tema";
import { criarEstadoInicial } from "./domain/timer";
import {
  aoInstantaneo,
  emitirComandoFlutuante,
  isTauri,
  restaurarPrincipal,
} from "./overlay/tauriOverlay";
import { observarInstantaneo } from "./storage/instantaneo";

const LIMIAR_ARRASTO_PX = 6;
const SNAP_PARADO = instantaneoDeEstado(criarEstadoInicial());

export default function FloatApp() {
  const origem = useRef<{ x: number; y: number } | null>(null);
  const arrastou = useRef(false);
  const [agora, setAgora] = useState(() => new Date());
  const [snap, setSnap] = useState(SNAP_PARADO);
  const relogio = formatarRelogioFlutuante(agora);
  const restante = remainingDoInstantaneo(snap, agora.getTime());
  const progresso = progressoRestante(restante, snap.totalMs);
  const rodando = snap.phase === "running";
  const rotuloAcao = rodando
    ? COPY.pausar
    : snap.phase === "paused"
      ? COPY.retomar
      : COPY.iniciar;

  useEffect(() => {
    const parar = observarInstantaneo(setSnap);
    if (!isTauri()) {
      return parar;
    }
    let ativo = true;
    let unlisten: (() => void) | undefined;
    void aoInstantaneo(setSnap).then((fn) => {
      if (ativo) {
        unlisten = fn;
      } else {
        fn();
      }
    });
    return () => {
      ativo = false;
      parar();
      unlisten?.();
    };
  }, []);

  useEffect(() => {
    const ms = snap.phase === "running" ? 100 : 1000;
    const id = window.setInterval(() => {
      setAgora(new Date());
    }, ms);
    return () => window.clearInterval(id);
  }, [snap.phase]);

  function onPointerDown(evento: PointerEvent<HTMLButtonElement>) {
    origem.current = { x: evento.clientX, y: evento.clientY };
    arrastou.current = false;
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  async function onPointerMove(evento: PointerEvent<HTMLButtonElement>) {
    if (!origem.current || arrastou.current) {
      return;
    }
    const dx = evento.clientX - origem.current.x;
    const dy = evento.clientY - origem.current.y;
    if (dx * dx + dy * dy < LIMIAR_ARRASTO_PX * LIMIAR_ARRASTO_PX) {
      return;
    }
    arrastou.current = true;
    if (!isTauri()) {
      return;
    }
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    await getCurrentWindow().startDragging();
  }

  function onPointerUp() {
    const clique = origem.current != null && !arrastou.current;
    origem.current = null;
    if (clique) {
      void restaurarPrincipal();
    }
  }

  function onAcao(evento: PointerEvent<HTMLButtonElement>) {
    evento.stopPropagation();
  }

  function onCliqueAcao(evento: MouseEvent<HTMLButtonElement>) {
    evento.stopPropagation();
    emitirComandoFlutuante(rodando ? "pausar" : "iniciar");
  }

  return (
    <div className="icone-flutuante">
      <button
        type="button"
        className="flutuante-arraste"
        aria-label={`${COPY.iconeFlutuante}, ${relogio.hora}, ${relogio.data}`}
        data-testid="float-icon"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <AnelTempo compacto progresso={progresso} cor={corDoModo(snap.mode)}>
          <img src={iconePomodoro} alt="" draggable={false} />
          <span className="flutuante-hora" data-testid="float-clock">
            {relogio.hora}
          </span>
          <span className="flutuante-data" data-testid="float-date">
            {relogio.data}
          </span>
        </AnelTempo>
      </button>
      <button
        type="button"
        className="flutuante-acao"
        aria-label={rotuloAcao}
        data-testid="float-play"
        onPointerDown={onAcao}
        onClick={onCliqueAcao}
      >
        {rodando ? (
          <IconePausa className="icone" />
        ) : (
          <IconePlay className="icone flutuante-play-icone" />
        )}
      </button>
    </div>
  );
}
