import { FormEvent, useState } from "react";
import { COPY } from "../constants/copy";
import { RECADO_OVERLAY_MAX } from "../domain/overlayCopy";

type Props = {
  valorInicial: string;
  placeholder: string;
  onSalvar: (texto: string) => void;
  onCancelar: () => void;
};

export function EditarRecadoOverlay({
  valorInicial,
  placeholder,
  onSalvar,
  onCancelar,
}: Props) {
  const [texto, setTexto] = useState(valorInicial);

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    onSalvar(texto);
  }

  return (
    <div
      className="pedido-atualizacao"
      data-testid="edit-overlay-copy"
      role="dialog"
      aria-modal="true"
      aria-labelledby="editar-recado-titulo"
    >
      <form className="pedido-atualizacao-caixa" onSubmit={enviar}>
        <h1 id="editar-recado-titulo">{COPY.recadoOverlayTitulo}</h1>
        <p>{COPY.recadoOverlayAjuda}</p>
        <label className="campo-recado" htmlFor="recado-overlay">
          <span className="campo-config-rotulo">{COPY.recadoOverlayCampo}</span>
          <textarea
            id="recado-overlay"
            data-testid="overlay-copy-input"
            rows={3}
            maxLength={RECADO_OVERLAY_MAX}
            value={texto}
            placeholder={placeholder}
            onChange={(evento) => setTexto(evento.target.value)}
          />
        </label>
        <div className="pedido-atualizacao-acoes">
          <button type="button" className="botao-secundario" onClick={onCancelar}>
            {COPY.cancelar}
          </button>
          <button type="submit" className="botao-principal">
            {COPY.salvar}
          </button>
        </div>
      </form>
    </div>
  );
}
