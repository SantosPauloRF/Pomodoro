import { describe, expect, it } from "vitest";
import { FOCO_MS, PAUSA_LONGA_MS, PAUSA_MS } from "../constants/timer";
import {
  duracoesDaBusca,
  focoNoCicloDaBusca,
  minutosValidos,
  parseDuracoesSalvas,
} from "./duracoes";

describe("duracoesDaBusca", () => {
  it("usa o padrão sem query", () => {
    expect(duracoesDaBusca("")).toEqual({
      focoMs: FOCO_MS,
      pausaMs: PAUSA_MS,
      pausaLongaMs: PAUSA_LONGA_MS,
    });
  });

  it("lê focoMs, pausaMs e pausaLongaMs da query", () => {
    expect(
      duracoesDaBusca("?focoMs=2000&pausaMs=3000&pausaLongaMs=4000"),
    ).toEqual({
      focoMs: 2000,
      pausaMs: 3000,
      pausaLongaMs: 4000,
    });
  });

  it("ignora valores inválidos", () => {
    expect(duracoesDaBusca("?focoMs=-1&pausaMs=abc")).toEqual({
      focoMs: FOCO_MS,
      pausaMs: PAUSA_MS,
      pausaLongaMs: PAUSA_LONGA_MS,
    });
  });

  it("query prevalece sobre valores salvos", () => {
    expect(
      duracoesDaBusca("?focoMs=1111", {
        focoMs: 9,
        pausaMs: 8,
        pausaLongaMs: 7,
      }),
    ).toEqual({
      focoMs: 1111,
      pausaMs: 8,
      pausaLongaMs: 7,
    });
  });
});

describe("parseDuracoesSalvas", () => {
  it("lê JSON válido", () => {
    expect(
      parseDuracoesSalvas(
        JSON.stringify({ focoMs: 1, pausaMs: 2, pausaLongaMs: 3 }),
      ),
    ).toEqual({ focoMs: 1, pausaMs: 2, pausaLongaMs: 3 });
  });

  it("rejeita JSON inválido", () => {
    expect(parseDuracoesSalvas("{")).toBeNull();
    expect(parseDuracoesSalvas(null)).toBeNull();
  });
});

describe("focoNoCicloDaBusca", () => {
  it("lê o passo do ciclo", () => {
    expect(focoNoCicloDaBusca("?focoNoCiclo=4")).toBe(4);
    expect(focoNoCicloDaBusca("")).toBe(1);
  });
});

describe("minutosValidos", () => {
  it("aceita inteiros no intervalo", () => {
    expect(minutosValidos(1)).toBe(true);
    expect(minutosValidos(25)).toBe(true);
    expect(minutosValidos(0)).toBe(false);
    expect(minutosValidos(1.5)).toBe(false);
  });
});
