import { COPY } from "../constants/copy";

type Props = {
  versao: string;
  notas: string;
  baixando: boolean;
  erro: string | null;
  onAtualizar: () => void;
  onAgoraNao: () => void;
};

export function PedidoAtualizacao({
  versao,
  notas,
  baixando,
  erro,
  onAtualizar,
  onAgoraNao,
}: Props) {
  return (
    <div
      className="pedido-atualizacao"
      data-testid="update-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pedido-atualizacao-titulo"
    >
      <div className="pedido-atualizacao-caixa">
        <h1 id="pedido-atualizacao-titulo">{COPY.atualizacaoTitulo}</h1>
        <p>
          {COPY.atualizacaoTexto} ({versao})
        </p>
        {notas ? <p className="pedido-atualizacao-notas">{notas}</p> : null}
        {baixando ? <p>{COPY.atualizacaoBaixando}</p> : null}
        {erro ? <p className="erro">{erro}</p> : null}
        <div className="pedido-atualizacao-acoes">
          <button
            type="button"
            className="botao-secundario"
            data-testid="update-later"
            onClick={onAgoraNao}
            disabled={baixando}
          >
            {COPY.atualizacaoAgoraNao}
          </button>
          <button
            type="button"
            className="botao-principal"
            data-testid="update-now"
            onClick={onAtualizar}
            disabled={baixando}
          >
            {COPY.atualizacaoAtualizar}
          </button>
        </div>
      </div>
    </div>
  );
}
