import { describe, expect, it } from "vitest";
import { FOCO_MS, PAUSA_MS } from "../constants/timer";
import { duracoesDaBusca } from "./duracoes";

describe("duracoesDaBusca", () => {
  it("usa o padrão sem query", () => {
    expect(duracoesDaBusca("")).toEqual({ focoMs: FOCO_MS, pausaMs: PAUSA_MS });
  });

  it("lê focoMs e pausaMs da query", () => {
    expect(duracoesDaBusca("?focoMs=2000&pausaMs=3000")).toEqual({
      focoMs: 2000,
      pausaMs: 3000,
    });
  });

  it("ignora valores inválidos", () => {
    expect(duracoesDaBusca("?focoMs=-1&pausaMs=abc")).toEqual({
      focoMs: FOCO_MS,
      pausaMs: PAUSA_MS,
    });
  });
});
