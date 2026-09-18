import { FormEvent, ReactNode, useEffect, useState } from "react";
import iconePomodoro from "../assets/icone-pomodoro.png";
import { COPY } from "../constants/copy";
import { pararSomOverlay, tocarSomOverlay } from "../audio/player";
import {
  minutosParaMs,
  minutosValidos,
  msParaMinutos,
} from "../domain/duracoes";
import type { SomModo, SonsConfig } from "../domain/sons";
import type { Duracoes, Mode } from "../types/timer";
import { ConfigSomModo } from "./ConfigSomModo";
import { IconeAlvo, IconeXicara } from "./Icones";

type Props = {
  duracoes: Duracoes;
  sons: SonsConfig;
  onSalvar: (duracoes: Duracoes, sons: SonsConfig) => void;
  onVoltar: () => void;
};

type CartaoProps = {
  titulo: string;
  icone: ReactNode;
  inputId: string;
  testId: string;
  minutos: string;
  onMinutos: (valor: string) => void;
  ariaMinutos: string;
  modo: Mode;
  som: SomModo;
  onSom: (valor: SomModo) => void;
  onOuvir: () => void;
};

function CartaoModo({
  titulo,
  icone,
  inputId,
  testId,
  minutos,
  onMinutos,
  ariaMinutos,
  modo,
  som,
  onSom,
  onOuvir,
}: CartaoProps) {
  const tituloId = `${inputId}-titulo`;
  return (
    <section className="campo-config" aria-labelledby={tituloId}>
      <h2 id={tituloId} className="campo-config-rotulo">
        {icone}
        {titulo}
      </h2>
      <ConfigSomModo
        modo={modo}
        valor={som}
        onChange={onSom}
        onOuvir={onOuvir}
        tempo={
          <label className="config-col config-col-tempo" htmlFor={inputId}>
            <span className="config-col-titulo">{COPY.configTempo}</span>
            <input
              id={inputId}
              data-testid={testId}
              type="number"
              min={1}
              max={180}
              step={1}
              aria-label={ariaMinutos}
              value={minutos}
              onChange={(e) => onMinutos(e.target.value)}
            />
          </label>
        }
      />
    </section>
  );
}

export function ConfigScreen({ duracoes, sons, onSalvar, onVoltar }: Props) {
  const [foco, setFoco] = useState(String(msParaMinutos(duracoes.focoMs)));
  const [pausa, setPausa] = useState(String(msParaMinutos(duracoes.pausaMs)));
  const [pausaLonga, setPausaLonga] = useState(
    String(msParaMinutos(duracoes.pausaLongaMs)),
  );
  const [sonsLocais, setSonsLocais] = useState(sons);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    return () => {
      pararSomOverlay();
    };
  }, []);

  function atualizarSom(chave: keyof SonsConfig, valor: SomModo) {
    setSonsLocais((atual) => ({ ...atual, [chave]: valor }));
  }

  function ouvir(modo: SomModo) {
    void tocarSomOverlay({ ...modo, loop: false });
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    const focoMin = Number(foco);
    const pausaMin = Number(pausa);
    const longaMin = Number(pausaLonga);
    if (
      !minutosValidos(focoMin) ||
      !minutosValidos(pausaMin) ||
      !minutosValidos(longaMin)
    ) {
      setErro(true);
      return;
    }
    setErro(false);
    pararSomOverlay();
    onSalvar(
      {
        focoMs: minutosParaMs(focoMin),
        pausaMs: minutosParaMs(pausaMin),
        pausaLongaMs: minutosParaMs(longaMin),
      },
      sonsLocais,
    );
  }

  return (
    <main className="tela tela-config">
      <div className="marca">
        <img src={iconePomodoro} alt="" className="logo-app" />
        <h1>
          {COPY.tituloApp}{" "}
          <span className="marca-timer">{COPY.tituloTimer}</span>
        </h1>
        <p className="slogan">{COPY.configTitulo}</p>
      </div>
      <form className="form-config" onSubmit={enviar}>
        <div className="config-cartoes">
          <CartaoModo
            titulo={COPY.foco}
            icone={<IconeAlvo className="icone icone-coral" />}
            inputId="config-foco"
            testId="config-foco"
            minutos={foco}
            onMinutos={setFoco}
            ariaMinutos={COPY.configFoco}
            modo="foco"
            som={sonsLocais.foco}
            onSom={(valor) => atualizarSom("foco", valor)}
            onOuvir={() => ouvir(sonsLocais.foco)}
          />
          <CartaoModo
            titulo={COPY.pausa}
            icone={<IconeXicara className="icone icone-verde" />}
            inputId="config-pausa"
            testId="config-pausa"
            minutos={pausa}
            onMinutos={setPausa}
            ariaMinutos={COPY.configPausa}
            modo="pausa"
            som={sonsLocais.pausa}
            onSom={(valor) => atualizarSom("pausa", valor)}
            onOuvir={() => ouvir(sonsLocais.pausa)}
          />
          <CartaoModo
            titulo={COPY.pausaLonga}
            icone={<IconeXicara className="icone icone-ouro" />}
            inputId="config-pausa-longa"
            testId="config-pausa-longa"
            minutos={pausaLonga}
            onMinutos={setPausaLonga}
            ariaMinutos={COPY.configPausaLonga}
            modo="pausaLonga"
            som={sonsLocais.pausaLonga}
            onSom={(valor) => atualizarSom("pausaLonga", valor)}
            onOuvir={() => ouvir(sonsLocais.pausaLonga)}
          />
        </div>
        {erro ? (
          <p className="erro" role="alert">
            {COPY.configErro}
          </p>
        ) : null}
        <div className="acoes">
          <button type="submit" className="botao-principal">
            {COPY.salvar}
          </button>
          <button
            type="button"
            className="botao-secundario"
            onClick={() => {
              pararSomOverlay();
              onVoltar();
            }}
          >
            {COPY.voltar}
          </button>
        </div>
      </form>
    </main>
  );
}
