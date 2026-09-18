import { describe, expect, it } from "vitest";
import {
  pedidoAtualizacaoNaBusca,
  podeMostrarPedidoAtualizacao,
} from "./atualizacao";

describe("pedido de atualização", () => {
  it("não mostra o diálogo por cima do overlay ao zerar", () => {
    expect(podeMostrarPedidoAtualizacao("overlay")).toBe(false);
    expect(podeMostrarPedidoAtualizacao("idle")).toBe(true);
    expect(podeMostrarPedidoAtualizacao("running")).toBe(true);
  });

  it("liga o diálogo de prévia pela busca", () => {
    expect(pedidoAtualizacaoNaBusca("?atualizacao=1")).toBe(true);
    expect(pedidoAtualizacaoNaBusca("")).toBe(false);
    expect(pedidoAtualizacaoNaBusca("?focoMs=1000")).toBe(false);
  });
});
