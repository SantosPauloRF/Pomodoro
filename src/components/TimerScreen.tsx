import iconePomodoro from "../assets/icone-pomodoro.png";
import { COPY } from "../constants/copy";
import { FOCOS_POR_CICLO } from "../constants/timer";
import { msParaMinutos } from "../domain/duracoes";
import { formatarTempo } from "../domain/formatTime";
import { progressoRestante } from "../domain/progresso";
import { corDoModo } from "../domain/tema";
import { duracaoDoModo } from "../domain/timer";
import type { Mode, TimerState } from "../types/timer";
import { AnelTempo } from "./AnelTempo";
import {
  IconeAlvo,
  IconeEngrenagem,
  IconeLapis,
  IconePausa,
  IconePlay,
  IconePular,
  IconeResetar,
  IconeSino,
  IconeXicara,
} from "./Icones";

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

function recado(mode: Mode, phase: TimerState["phase"]): string {
  if (mode === "foco") {
    if (phase === "running") {
      return COPY.recadoFocoAndamento;
    }
    if (phase === "paused") {
      return COPY.recadoFocoPausado;
    }
    return COPY.recadoFoco;
  }
  if (mode === "pausaLonga") {
    if (phase === "running") {
      return COPY.recadoPausaLongaAndamento;
    }
    if (phase === "paused") {
      return COPY.recadoPausaPausada;
    }
    return COPY.recadoPausaLonga;
  }
  if (phase === "running") {
    return COPY.recadoPausaAndamento;
  }
  if (phase === "paused") {
    return COPY.recadoPausaPausada;
  }
  return COPY.recadoPausa;
}

export function TimerScreen({
  state,
  onIniciar,
  onPausar,
  onResetar,
  onPular,
  onAbrirConfig,
}: Props) {
  const progresso = progressoRestante(
    state.remainingMs,
    duracaoDoModo(state.mode, state.duracoes),
  );
  const acaoPrincipal =
    state.phase === "running"
      ? { rotulo: COPY.pausar, onClick: onPausar, icone: "pausar" as const }
      : {
          rotulo: state.phase === "paused" ? COPY.retomar : rotuloIniciar(state.mode),
          onClick: onIniciar,
          icone: "play" as const,
        };

  return (
    <main className="tela">
      <header className="topo">
        <span className="topo-vazio" />
        <button
          type="button"
          className="botao-icone"
          aria-label={COPY.configuracoes}
          onClick={onAbrirConfig}
        >
          <IconeEngrenagem className="icone" />
        </button>
      </header>

      <div className="marca">
        <img src={iconePomodoro} alt="" className="logo-app" />
        <h1>
          {COPY.tituloApp}{" "}
          <span className="marca-timer">{COPY.tituloTimer}</span>
        </h1>
        <p className="slogan">{COPY.slogan}</p>
      </div>

      <div className="anel-linha">
        <article className="cartao">
          <IconeAlvo className="icone icone-coral" />
          <p className="cartao-titulo">{COPY.cicloCartao}</p>
          <p className="cartao-valor" data-testid="cycle-label">
            {state.focoNoCiclo} de {FOCOS_POR_CICLO}
          </p>
        </article>

        <AnelTempo progresso={progresso} cor={corDoModo(state.mode)}>
          <p className="anel-modo" data-testid="mode-label">
            {rotuloModo(state.mode)}
          </p>
          <p className="tempo" data-testid="timer-display" aria-live="polite">
            {formatarTempo(state.remainingMs)}
          </p>
          <p className="anel-recado">
            <IconeSino className="icone" />
            {recado(state.mode, state.phase)}
          </p>
        </AnelTempo>

        <button
          type="button"
          className="cartao cartao-botao"
          aria-label={COPY.pular}
          data-testid="skip"
          onClick={onPular}
        >
          <IconePular className="icone icone-coral" />
          <p className="cartao-titulo">{COPY.pular}</p>
          <p className="cartao-valor">{COPY.pularAjuda}</p>
        </button>
      </div>

      <div className="acoes">
        <button type="button" className="botao-principal" onClick={acaoPrincipal.onClick}>
          {acaoPrincipal.icone === "pausar" ? (
            <IconePausa className="icone" />
          ) : (
            <IconePlay className="icone" />
          )}
          {acaoPrincipal.rotulo}
        </button>
        <button
          type="button"
          className="botao-circular"
          aria-label={COPY.resetar}
          onClick={onResetar}
        >
          <IconeResetar className="icone" />
        </button>
      </div>

      <div className="atalhos">
        <div className="atalho atalho-verde">
          <IconeXicara className="icone" />
          <div>
            <p className="atalho-titulo">{COPY.pausa}</p>
            <p className="atalho-valor">
              {msParaMinutos(state.duracoes.pausaMs)} min
            </p>
          </div>
        </div>
        <div className="atalho atalho-ouro">
          <IconeXicara className="icone" />
          <div>
            <p className="atalho-titulo">{COPY.pausaLonga}</p>
            <p className="atalho-valor">
              {msParaMinutos(state.duracoes.pausaLongaMs)} min
            </p>
          </div>
        </div>
        <button type="button" className="atalho atalho-azul" onClick={onAbrirConfig}>
          <IconeLapis className="icone" />
          <div>
            <p className="atalho-titulo">{COPY.editarChip}</p>
            <p className="atalho-valor">{COPY.editarTempos}</p>
          </div>
        </button>
      </div>
    </main>
  );
}
