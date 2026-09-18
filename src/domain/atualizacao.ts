import type { Phase } from "../types/timer";

export function podeMostrarPedidoAtualizacao(phase: Phase): boolean {
  return phase !== "overlay";
}

export function pedidoAtualizacaoNaBusca(search: string): boolean {
  return new URLSearchParams(search).get("atualizacao") === "1";
}
