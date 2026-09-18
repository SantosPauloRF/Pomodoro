import { useEffect, useMemo, useRef, useState } from "react";
import { tocarAlerta } from "./audio/alerta";
import {
  baixarEInstalar,
  checarAtualizacao,
  type AtualizacaoEncontrada,
} from "./atualizacao/checar";
import { ConfigScreen } from "./components/ConfigScreen";
import { OverlayPanel } from "./components/OverlayPanel";
import { PedidoAtualizacao } from "./components/PedidoAtualizacao";
import { TimerScreen } from "./components/TimerScreen";
import { COPY } from "./constants/copy";
import {
  pedidoAtualizacaoNaBusca,
  podeMostrarPedidoAtualizacao,
} from "./domain/atualizacao";
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
import { instantaneoDeEstado } from "./domain/instantaneo";
import {
  aoDispensarOverlay,
  abrirOverlayNativo,
  emitirInstantaneo,
  fecharOverlayNativo,
  isTauri,
  observarComandoFlutuante,
  restaurarPrincipal,
} from "./overlay/tauriOverlay";
import { gravarDuracoesLocal, lerDuracoesLocal } from "./storage/duracoes";
import { gravarInstantaneo } from "./storage/instantaneo";
import type { Duracoes } from "./types/timer";

export default function App() {
  const duracoes = useMemo(() => {
    return duracoesDaBusca(window.location.search, lerDuracoesLocal());
  }, []);
  const [state, setState] = useState(() =>
    criarEstadoInicial(duracoes, focoNoCicloDaBusca(window.location.search)),
  );
  const [tela, setTela] = useState<"timer" | "config">("timer");
  const [pedido, setPedido] = useState<{ versao: string; notas: string } | null>(
    () =>
      pedidoAtualizacaoNaBusca(window.location.search)
        ? { versao: "prévia", notas: "" }
        : null,
  );
  const [recusado, setRecusado] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const [erroAtualizacao, setErroAtualizacao] = useState<string | null>(null);
  const encontradaRef = useRef<AtualizacaoEncontrada | null>(null);

  useEffect(() => {
    if (pedidoAtualizacaoNaBusca(window.location.search) || !isTauri()) {
      return;
    }
    let ativo = true;
    void checarAtualizacao()
      .then((encontrada) => {
        if (!ativo || !encontrada) {
          return;
        }
        encontradaRef.current = encontrada;
        setPedido({ versao: encontrada.versao, notas: encontrada.notas });
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    const snap = instantaneoDeEstado(state);
    gravarInstantaneo(snap);
    if (isTauri()) {
      void emitirInstantaneo(snap);
    }
  }, [state]);

  useEffect(() => {
    if (!isTauri()) {
      return;
    }
    const id = window.setInterval(() => {
      void emitirInstantaneo(instantaneoDeEstado(state));
    }, 800);
    return () => window.clearInterval(id);
  }, [state]);

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
    return observarComandoFlutuante((comando) => {
      setState((atual) => {
        if (comando === "pausar") {
          return pausar(atual, Date.now());
        }
        return iniciar(atual, Date.now());
      });
    });
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

  async function atualizarAgora() {
    setBaixando(true);
    setErroAtualizacao(null);
    const encontrada = encontradaRef.current;
    if (!encontrada) {
      setBaixando(false);
      return;
    }
    try {
      await baixarEInstalar(encontrada.update);
    } catch {
      setBaixando(false);
      setErroAtualizacao(COPY.atualizacaoErro);
    }
  }

  const mostrarPedido =
    pedido != null &&
    !recusado &&
    podeMostrarPedidoAtualizacao(state.phase);

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
      {mostrarPedido && pedido ? (
        <PedidoAtualizacao
          versao={pedido.versao}
          notas={pedido.notas}
          baixando={baixando}
          erro={erroAtualizacao}
          onAtualizar={() => {
            void atualizarAgora();
          }}
          onAgoraNao={() => setRecusado(true)}
        />
      ) : null}
    </>
  );
}
