import { describe, expect, it } from "vitest";
import {
  instantaneoDeEstado,
  parseInstantaneo,
  remainingDoInstantaneo,
} from "./instantaneo";
import { criarEstadoInicial, iniciar } from "./timer";

describe("instantaneo flutuante", () => {
  it("copia modo, fase e duração do estado", () => {
    const estado = criarEstadoInicial({ focoMs: 25_000 });
    expect(instantaneoDeEstado(estado)).toMatchObject({
      remainingMs: 25_000,
      totalMs: 25_000,
      phase: "idle",
      mode: "foco",
    });
  });

  it("calcula o restante com relógio de parede enquanto corre", () => {
    const estado = iniciar(criarEstadoInicial({ focoMs: 10_000 }), 1_000);
    const snap = instantaneoDeEstado(estado);
    expect(remainingDoInstantaneo(snap, 4_000)).toBe(7_000);
  });

  it("não anda o tempo quando está pausado", () => {
    const snap = parseInstantaneo(
      JSON.stringify({
        remainingMs: 8_000,
        totalMs: 10_000,
        phase: "paused",
        mode: "pausa",
        runningSince: null,
        remainingAtRunStart: null,
      }),
    );
    expect(snap).not.toBeNull();
    expect(remainingDoInstantaneo(snap!, 99_000)).toBe(8_000);
  });

  it("ignora JSON inválido", () => {
    expect(parseInstantaneo("{")).toBeNull();
    expect(parseInstantaneo(null)).toBeNull();
  });
});
