import { useEffect, useMemo, useState } from "react";
import { tocarAlerta } from "./audio/alerta";
import { ConfigScreen } from "./components/ConfigScreen";
import { OverlayPanel } from "./components/OverlayPanel";
import { TimerScreen } from "./components/TimerScreen";
import {
  duracoesDaBusca,
  focoNoCicloDaBusca,
} from "./domain/duracoes";
import {
  aplicarDuracoes,
  criarEstadoInicial,
  dispensarOverlay,
  iniciar,
  pausar,
  pular,
  resetar,
  sincronizar,
} from "./domain/timer";
import {
  aoDispensarOverlay,
  abrirOverlayNativo,
  fecharOverlayNativo,
  isTauri,
  restaurarPrincipal,
} from "./overlay/tauriOverlay";
import { gravarDuracoesLocal, lerDuracoesLocal } from "./storage/duracoes";
import type { Duracoes } from "./types/timer";

export default function App() {
  const duracoes = useMemo(() => {
    return duracoesDaBusca(window.location.search, lerDuracoesLocal());
  }, []);
  const [state, setState] = useState(() =>
    criarEstadoInicial(duracoes, focoNoCicloDaBusca(window.location.search)),
  );
  const [tela, setTela] = useState<"timer" | "config">("timer");

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
      void abrirOverlayNativo(state.mode).catch(() => {
        void restaurarPrincipal();
      });
    }
  }, [state.phase, state.mode]);

  function dispensarNaPagina() {
    setState((atual) => dispensarOverlay(atual));
    if (isTauri()) {
      void fecharOverlayNativo().catch(() => {
        void restaurarPrincipal();
      });
    }
  }

  function salvarConfig(novas: Duracoes) {
    gravarDuracoesLocal(novas);
    setState((atual) => aplicarDuracoes(atual, novas));
    setTela("timer");
  }

  return (
    <>
      {tela === "config" ? (
        <ConfigScreen
          duracoes={state.duracoes}
          onSalvar={salvarConfig}
          onVoltar={() => setTela("timer")}
        />
      ) : state.phase === "overlay" ? null : (
        <TimerScreen
          state={state}
          onIniciar={() => setState((atual) => iniciar(atual, Date.now()))}
          onPausar={() => setState((atual) => pausar(atual, Date.now()))}
          onResetar={() => setState((atual) => resetar(atual))}
          onPular={() => setState((atual) => pular(atual))}
          onAbrirConfig={() => setTela("config")}
        />
      )}
      {state.phase === "overlay" ? (
        <OverlayPanel motivo={state.mode} onDispensar={dispensarNaPagina} />
      ) : null}
    </>
  );
}
