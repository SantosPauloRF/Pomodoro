import { FormEvent, useState } from "react";
import { COPY } from "../constants/copy";
import {
  minutosParaMs,
  minutosValidos,
  msParaMinutos,
} from "../domain/duracoes";
import type { Duracoes } from "../types/timer";

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
      <h1>{COPY.configTitulo}</h1>
      <p className="ajuda">{COPY.configAjuda}</p>
      <form className="form-config" onSubmit={enviar}>
        <label htmlFor="config-foco">{COPY.configFoco}</label>
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
        <label htmlFor="config-pausa">{COPY.configPausa}</label>
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
        <label htmlFor="config-pausa-longa">{COPY.configPausaLonga}</label>
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
        {erro ? (
          <p className="erro" role="alert">
            {COPY.configErro}
          </p>
        ) : null}
        <div className="acoes">
          <button type="submit">{COPY.salvar}</button>
          <button type="button" className="secundario" onClick={onVoltar}>
            {COPY.voltar}
          </button>
        </div>
      </form>
    </main>
  );
}
