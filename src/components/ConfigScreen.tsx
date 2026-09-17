import { FormEvent, useState } from "react";
import iconePomodoro from "../assets/icone-pomodoro.png";
import { COPY } from "../constants/copy";
import {
  minutosParaMs,
  minutosValidos,
  msParaMinutos,
} from "../domain/duracoes";
import type { Duracoes } from "../types/timer";
import { IconeAlvo, IconeXicara } from "./Icones";

type Props = {
  duracoes: Duracoes;
  onSalvar: (duracoes: Duracoes) => void;
  onVoltar: () => void;
};

export function ConfigScreen({ duracoes, onSalvar, onVoltar }: Props) {
  const [foco, setFoco] = useState(String(msParaMinutos(duracoes.focoMs)));
  const [pausa, setPausa] = useState(String(msParaMinutos(duracoes.pausaMs)));
  const [pausaLonga, setPausaLonga] = useState(
    String(msParaMinutos(duracoes.pausaLongaMs)),
  );
  const [erro, setErro] = useState(false);

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
    onSalvar({
      focoMs: minutosParaMs(focoMin),
      pausaMs: minutosParaMs(pausaMin),
      pausaLongaMs: minutosParaMs(longaMin),
    });
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
      <p className="ajuda">{COPY.configAjuda}</p>
      <form className="form-config" onSubmit={enviar}>
        <label className="campo-config" htmlFor="config-foco">
          <span className="campo-config-rotulo">
            <IconeAlvo className="icone icone-coral" />
            {COPY.configFoco}
          </span>
          <input
            id="config-foco"
            data-testid="config-foco"
            type="number"
            min={1}
            max={180}
            step={1}
            value={foco}
            onChange={(e) => setFoco(e.target.value)}
          />
        </label>
        <label className="campo-config" htmlFor="config-pausa">
          <span className="campo-config-rotulo">
            <IconeXicara className="icone icone-verde" />
            {COPY.configPausa}
          </span>
          <input
            id="config-pausa"
            data-testid="config-pausa"
            type="number"
            min={1}
            max={180}
            step={1}
            value={pausa}
            onChange={(e) => setPausa(e.target.value)}
          />
        </label>
        <label className="campo-config" htmlFor="config-pausa-longa">
          <span className="campo-config-rotulo">
            <IconeXicara className="icone icone-ouro" />
            {COPY.configPausaLonga}
          </span>
          <input
            id="config-pausa-longa"
            data-testid="config-pausa-longa"
            type="number"
            min={1}
            max={180}
            step={1}
            value={pausaLonga}
            onChange={(e) => setPausaLonga(e.target.value)}
          />
        </label>
        {erro ? (
          <p className="erro" role="alert">
            {COPY.configErro}
          </p>
        ) : null}
        <div className="acoes">
          <button type="submit" className="botao-principal">
            {COPY.salvar}
          </button>
          <button type="button" className="botao-secundario" onClick={onVoltar}>
            {COPY.voltar}
          </button>
        </div>
      </form>
    </main>
  );
}
