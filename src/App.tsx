import { useEffect, useMemo, useState } from "react";
import { tocarAlerta } from "./audio/alerta";
import { TimerScreen } from "./components/TimerScreen";
import { OverlayPanel } from "./components/OverlayPanel";
import { duracoesDaBusca } from "./domain/duracoes";
import {
  criarEstadoInicial,
  dispensarOverlay,
  iniciar,
  pausar,
  resetar,
  sincronizar,
} from "./domain/timer";
import {
  abrirOverlayNativo,
  aoDispensarOverlay,
  fecharOverlayNativo,
  isTauri,
} from "./overlay/tauriOverlay";

export default function App() {
  const duracoes = useMemo(
    () => duracoesDaBusca(window.location.search),
    [],
  );
  const [state, setState] = useState(() => criarEstadoInicial(duracoes));

  useEffect(() => {
    if (state.phase !== "running") {
      return;
    }
    const id = window.setInterval(() => {
      setState((atual) => sincronizar(atual, Date.now()));
    }, 100);
    return () => window.clearInterval(id);
  }, [state.phase]);

  useEffect(() => {
    if (!isTauri()) {
      return;
    }
    let ativo = true;
    let unlisten: (() => void) | undefined;
    void aoDispensarOverlay(() => {
      setState((atual) => dispensarOverlay(atual));
    }).then((fn) => {
      if (ativo) {
        unlisten = fn;
      } else {
        fn();
      }
    });
    return () => {
      ativo = false;
      unlisten?.();
    };
  }, []);

  useEffect(() => {
    if (state.phase !== "overlay") {
      return;
    }
    void tocarAlerta();
    if (isTauri()) {
      void abrirOverlayNativo(state.mode);
    }
  }, [state.phase, state.mode]);

  function dispensarNaPagina() {
    if (isTauri()) {
      void fecharOverlayNativo();
      return;
    }
    setState((atual) => dispensarOverlay(atual));
  }

  return (
    <>
      <TimerScreen
        state={state}
        onIniciar={() => setState((atual) => iniciar(atual, Date.now()))}
        onPausar={() => setState((atual) => pausar(atual, Date.now()))}
        onResetar={() => setState((atual) => resetar(atual))}
      />
      {state.phase === "overlay" ? (
        <OverlayPanel motivo={state.mode} onDispensar={dispensarNaPagina} />
      ) : null}
    </>
  );
}
