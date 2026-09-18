import { useEffect, useMemo, useRef, useState } from "react";
import { pararSomOverlay, prepararAudio, tocarSomOverlay } from "./audio/player";
import {
  baixarEInstalar,
  checarAtualizacao,
  type AtualizacaoEncontrada,
} from "./atualizacao/checar";
import { ConfigScreen } from "./components/ConfigScreen";
import { EditarRecadoOverlay } from "./components/EditarRecadoOverlay";
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
import { somDoModo, sonsPadrao } from "./domain/sons";
import {
  normalizarRecadoOverlay,
  tituloOverlayPadrao,
} from "./domain/overlayCopy";
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
import { gravarRecadoOverlay, lerRecadoOverlay } from "./storage/recadoOverlay";
import { gravarSonsLocal, lerSonsLocal } from "./storage/sons";
import type { SonsConfig } from "./domain/sons";

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
  const [proximoRecado, setProximoRecado] = useState<string | null>(
    () => lerRecadoOverlay(),
  );
  const [editandoRecado, setEditandoRecado] = useState(false);
  const [sons, setSons] = useState<SonsConfig>(() => lerSonsLocal() ?? sonsPadrao());

  function consumirRecado() {
    setProximoRecado(null);
    gravarRecadoOverlay(null);
  }

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
      pararSomOverlay();
      consumirRecado();
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
        void prepararAudio();
        return iniciar(atual, Date.now());
      });
    });
  }, []);

  useEffect(() => {
    if (state.phase !== "overlay") {
      pararSomOverlay();
      return;
    }
    setEditandoRecado(false);
    void tocarSomOverlay(somDoModo(sons, state.mode));
    if (isTauri()) {
      void abrirOverlayNativo(state.mode, proximoRecado).catch(() => {
        void restaurarPrincipal();
      });
    }
    return () => {
      pararSomOverlay();
    };
  }, [state.phase, state.mode, proximoRecado, sons]);

  function dispensarNaPagina() {
    pararSomOverlay();
    consumirRecado();
    setState((atual) => dispensarOverlay(atual));
    if (isTauri()) {
      void fecharOverlayNativo().catch(() => {
        void restaurarPrincipal();
      });
    }
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
          sons={sons}
          onSalvar={(novas, novosSons) => {
            gravarDuracoesLocal(novas);
            gravarSonsLocal(novosSons);
            setSons(novosSons);
            setState((atual) => aplicarDuracoes(atual, novas));
            setTela("timer");
          }}
          onVoltar={() => setTela("timer")}
        />
      ) : state.phase === "overlay" ? null : (
        <TimerScreen
          state={state}
          onIniciar={() => {
            void prepararAudio();
            setState((atual) => iniciar(atual, Date.now()));
          }}
          onPausar={() => setState((atual) => pausar(atual, Date.now()))}
          onResetar={() => setState((atual) => resetar(atual))}
          onPular={() => setState((atual) => pular(atual))}
          onAbrirConfig={() => setTela("config")}
          recadoPendente={proximoRecado != null}
          onEditarRecado={() => setEditandoRecado(true)}
        />
      )}
      {state.phase === "overlay" ? (
        <OverlayPanel
          motivo={state.mode}
          recado={proximoRecado}
          onDispensar={dispensarNaPagina}
        />
      ) : null}
      {editandoRecado ? (
        <EditarRecadoOverlay
          valorInicial={proximoRecado ?? ""}
          placeholder={tituloOverlayPadrao(state.mode)}
          onSalvar={(texto) => {
            const recado = normalizarRecadoOverlay(texto);
            setProximoRecado(recado);
            gravarRecadoOverlay(recado);
            setEditandoRecado(false);
          }}
          onCancelar={() => setEditandoRecado(false)}
        />
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
