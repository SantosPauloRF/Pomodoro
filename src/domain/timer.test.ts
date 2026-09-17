import { describe, expect, it } from "vitest";
import { FOCO_MS, PAUSA_MS } from "../constants/timer";
import {
  criarEstadoInicial,
  dispensarOverlay,
  iniciar,
  pausar,
  resetar,
  sincronizar,
} from "./timer";

describe("domínio do timer", () => {
  it("começa em idle no foco com a duração inicial", () => {
    const s = criarEstadoInicial();
    expect(s.mode).toBe("foco");
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(FOCO_MS);
  });

  it("inicia o foco a partir do idle", () => {
    const s = iniciar(criarEstadoInicial(), 1_000);
    expect(s.phase).toBe("running");
    expect(s.runningSince).toBe(1_000);
    expect(s.remainingAtRunStart).toBe(FOCO_MS);
  });

  it("desconta pelo relógio de parede, não pelo número de ticks", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 5_000, pausaMs: 2_000 }), 1_000);
    s = sincronizar(s, 3_000);
    expect(s.remainingMs).toBe(3_000);
    expect(s.phase).toBe("running");
  });

  it("pausa congela o restante mesmo se o relógio avançar", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 5_000, pausaMs: 2_000 }), 1_000);
    s = pausar(s, 2_000);
    expect(s.phase).toBe("paused");
    expect(s.remainingMs).toBe(4_000);
    s = sincronizar(s, 9_000);
    expect(s.remainingMs).toBe(4_000);
    s = iniciar(s, 9_000);
    s = sincronizar(s, 9_500);
    expect(s.phase).toBe("running");
    expect(s.remainingMs).toBe(3_500);
  });

  it("resetar no foco running volta ao idle foco com tempo cheio", () => {
    let s = iniciar(criarEstadoInicial(), 0);
    s = sincronizar(s, 8_000);
    s = resetar(s);
    expect(s.mode).toBe("foco");
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(FOCO_MS);
  });

  it("resetar no pausa paused não troca de modo nem abre overlay", () => {
    let s = criarEstadoInicial({ focoMs: 1_000, pausaMs: 8_000 });
    s = { ...s, mode: "pausa", remainingMs: 8_000 };
    s = iniciar(s, 0);
    s = pausar(s, 500);
    s = resetar(s);
    expect(s.mode).toBe("pausa");
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(8_000);
  });

  it("ao zerar o foco vai para overlay e não inicia a pausa", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 1_000, pausaMs: 5_000 }), 0);
    s = sincronizar(s, 1_000);
    expect(s.phase).toBe("overlay");
    expect(s.mode).toBe("foco");
    expect(s.remainingMs).toBe(0);
  });

  it("dispensar overlay após o foco vai para idle da pausa sem iniciar", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 1_000, pausaMs: 5_000 }), 0);
    s = sincronizar(s, 2_000);
    s = dispensarOverlay(s);
    expect(s.mode).toBe("pausa");
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(5_000);
  });

  it("dispensar overlay após a pausa volta para idle do foco", () => {
    let s = criarEstadoInicial({ focoMs: 4_000, pausaMs: 1_000 });
    s = { ...s, mode: "pausa", remainingMs: 1_000 };
    s = iniciar(s, 0);
    s = sincronizar(s, 1_000);
    s = dispensarOverlay(s);
    expect(s.mode).toBe("foco");
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(4_000);
  });

  it("resetar durante o overlay não faz nada", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 100, pausaMs: 100 }), 0);
    s = sincronizar(s, 100);
    const depois = resetar(s);
    expect(depois).toEqual(s);
    expect(depois.phase).toBe("overlay");
  });

  it("usa 25/5 como duração padrão", () => {
    expect(FOCO_MS).toBe(25 * 60 * 1000);
    expect(PAUSA_MS).toBe(5 * 60 * 1000);
  });
});
