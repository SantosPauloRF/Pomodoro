import { ReactNode, useEffect, useRef, useState } from "react";
import type { Mode } from "../types/timer";
import { COPY } from "../constants/copy";
import {
  somIdValido,
  SONS_CLASSICOS,
  SONS_GERAIS,
  SONS_PACOTE,
  type SomId,
  type SomModo,
} from "../domain/sons";

type Props = {
  modo: Mode;
  valor: SomModo;
  onChange: (valor: SomModo) => void;
  onOuvir: () => void;
  tempo: ReactNode;
};

function rotuloSom(modo: Mode): string {
  if (modo === "pausaLonga") {
    return COPY.configSomPausaLonga;
  }
  return modo === "pausa" ? COPY.configSomPausa : COPY.configSomFoco;
}

function nomeDoSom(id: SomId): string {
  return SONS_PACOTE.find((item) => item.id === id)?.nome ?? COPY.configSomNenhum;
}

type SelectSomProps = {
  id: string;
  nomeAria: string;
  valor: SomId;
  onEscolher: (id: SomId) => void;
};

function SelectSom({ id, nomeAria, valor, onEscolher }: SelectSomProps) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const listaId = `${id}-lista`;

  useEffect(() => {
    if (!aberto) {
      return;
    }
    function fecharFora(evento: MouseEvent) {
      if (!raiz.current?.contains(evento.target as Node)) {
        setAberto(false);
      }
    }
    function fecharTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", fecharFora);
    document.addEventListener("keydown", fecharTecla);
    return () => {
      document.removeEventListener("mousedown", fecharFora);
      document.removeEventListener("keydown", fecharTecla);
    };
  }, [aberto]);

  function escolher(idSom: SomId) {
    onEscolher(idSom);
    setAberto(false);
  }

  return (
    <div className="som-select" ref={raiz}>
      <button
        type="button"
        id={id}
        className="som-select-botao"
        aria-label={nomeAria}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={listaId}
        onClick={() => setAberto((atual) => !atual)}
      >
        {nomeDoSom(valor)}
      </button>
      {aberto ? (
        <div className="som-select-menu" id={listaId} role="listbox" aria-label={nomeAria}>
          <div className="som-select-grupo">
            <p className="som-select-subtitulo">{COPY.configSonsClassicos}</p>
            {SONS_CLASSICOS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={valor === item.id}
                className={
                  valor === item.id ? "som-select-opcao som-select-opcao-ativa" : "som-select-opcao"
                }
                onClick={() => escolher(item.id)}
              >
                {item.nome}
              </button>
            ))}
          </div>
          <div className="som-select-traco" aria-hidden="true" />
          <div className="som-select-grupo">
            <p className="som-select-subtitulo">{COPY.configSonsGerais}</p>
            {SONS_GERAIS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={valor === item.id}
                className={
                  valor === item.id ? "som-select-opcao som-select-opcao-ativa" : "som-select-opcao"
                }
                onClick={() => escolher(item.id)}
              >
                {item.nome}
              </button>
            ))}
          </div>
          <div className="som-select-traco" aria-hidden="true" />
          <button
            type="button"
            role="option"
            aria-selected={valor === "silencio"}
            className={
              valor === "silencio"
                ? "som-select-opcao som-select-opcao-ativa"
                : "som-select-opcao"
            }
            onClick={() => escolher("silencio")}
          >
            {COPY.configSomNenhum}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ConfigSomModo({
  modo,
  valor,
  onChange,
  onOuvir,
  tempo,
}: Props) {
  const idSom = `config-som-${modo}`;
  const idAltura = `config-altura-${modo}`;
  const idLoop = `config-loop-${modo}`;
  const nomeSom = rotuloSom(modo);

  return (
    <>
      <div className="config-linha-tempo-som">
        {tempo}
        <div className="config-col config-col-som">
          <span className="config-col-titulo" id={`${idSom}-titulo`}>
            {COPY.configSom}
          </span>
          <div className="som-linha">
            <SelectSom
              id={idSom}
              nomeAria={nomeSom}
              valor={valor.somId}
              onEscolher={(id) => {
                if (somIdValido(id)) {
                  onChange({ ...valor, somId: id });
                }
              }}
            />
            <button
              type="button"
              className="botao-secundario som-ouvir"
              onClick={onOuvir}
            >
              {COPY.configOuvir}
            </button>
          </div>
        </div>
      </div>
      <label className="som-altura" htmlFor={idAltura}>
        <span>
          {COPY.configAltura} {valor.altura}%
        </span>
        <input
          id={idAltura}
          type="range"
          min={0}
          max={100}
          step={1}
          value={valor.altura}
          onChange={(evento) =>
            onChange({ ...valor, altura: Number(evento.target.value) })
          }
        />
      </label>
      <label className="som-loop" htmlFor={idLoop}>
        <input
          id={idLoop}
          type="checkbox"
          checked={valor.loop}
          onChange={(evento) =>
            onChange({ ...valor, loop: evento.target.checked })
          }
        />
        {COPY.configLoop}
      </label>
    </>
  );
}
