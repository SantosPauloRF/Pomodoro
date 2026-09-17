import { describe, expect, it } from "vitest";
import {
  FOCO_MS,
  FOCOS_POR_CICLO,
  PAUSA_LONGA_MS,
  PAUSA_MS,
} from "../constants/timer";
import {
  aplicarDuracoes,
  criarEstadoInicial,
  dispensarOverlay,
  iniciar,
  pausar,
  pular,
  resetar,
  sincronizar,
} from "./timer";

describe("domínio do timer", () => {
  it("começa em idle no foco 1 com a duração inicial", () => {
    const s = criarEstadoInicial();
    expect(s.mode).toBe("foco");
    expect(s.phase).toBe("idle");
    expect(s.focoNoCiclo).toBe(1);
    expect(s.remainingMs).toBe(FOCO_MS);
    expect(s.duracoes.pausaLongaMs).toBe(PAUSA_LONGA_MS);
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
    expect(s.focoNoCiclo).toBe(1);
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

  it("dispensar overlay após o 1º foco vai para idle da pausa curta", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 1_000, pausaMs: 5_000 }), 0);
    s = sincronizar(s, 2_000);
    s = dispensarOverlay(s);
    expect(s.mode).toBe("pausa");
    expect(s.phase).toBe("idle");
    expect(s.focoNoCiclo).toBe(1);
    expect(s.remainingMs).toBe(5_000);
  });

  it("dispensar overlay após a pausa curta vai para o próximo foco", () => {
    let s = criarEstadoInicial({ focoMs: 4_000, pausaMs: 1_000 });
    s = { ...s, mode: "pausa", remainingMs: 1_000 };
    s = iniciar(s, 0);
    s = sincronizar(s, 1_000);
    s = dispensarOverlay(s);
    expect(s.mode).toBe("foco");
    expect(s.focoNoCiclo).toBe(2);
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(4_000);
  });

  it("depois do 4º foco vai para pausa longa e depois recomeça o ciclo", () => {
    let s = criarEstadoInicial(
      { focoMs: 100, pausaMs: 200, pausaLongaMs: 300 },
      FOCOS_POR_CICLO,
    );
    s = iniciar(s, 0);
    s = sincronizar(s, 100);
    s = dispensarOverlay(s);
    expect(s.mode).toBe("pausaLonga");
    expect(s.remainingMs).toBe(300);
    s = iniciar(s, 0);
    s = sincronizar(s, 300);
    s = dispensarOverlay(s);
    expect(s.mode).toBe("foco");
    expect(s.focoNoCiclo).toBe(1);
    expect(s.remainingMs).toBe(100);
  });

  it("resetar durante o overlay não faz nada", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 100, pausaMs: 100 }), 0);
    s = sincronizar(s, 100);
    const depois = resetar(s);
    expect(depois).toEqual(s);
    expect(depois.phase).toBe("overlay");
  });

  it("aplicar durações no idle atualiza o tempo cheio do modo", () => {
    const s = aplicarDuracoes(criarEstadoInicial(), {
      focoMs: 2_000,
      pausaMs: PAUSA_MS,
      pausaLongaMs: PAUSA_LONGA_MS,
    });
    expect(s.remainingMs).toBe(2_000);
    expect(s.duracoes.focoMs).toBe(2_000);
  });

  it("pular o foco idle vai para a pausa parada, sem overlay", () => {
    const s = pular(criarEstadoInicial({ focoMs: 4_000, pausaMs: 2_000 }));
    expect(s.mode).toBe("pausa");
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(2_000);
    expect(s.focoNoCiclo).toBe(1);
  });

  it("pular o foco em andamento vai para a pausa parada", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 4_000, pausaMs: 2_000 }), 0);
    s = pular(s);
    expect(s.mode).toBe("pausa");
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(2_000);
  });

  it("pular a pausa vai para o próximo foco parado", () => {
    let s = criarEstadoInicial({ focoMs: 4_000, pausaMs: 2_000 });
    s = { ...s, mode: "pausa", remainingMs: 2_000 };
    s = pular(s);
    expect(s.mode).toBe("foco");
    expect(s.focoNoCiclo).toBe(2);
    expect(s.phase).toBe("idle");
    expect(s.remainingMs).toBe(4_000);
  });

  it("pular durante o overlay não faz nada", () => {
    let s = iniciar(criarEstadoInicial({ focoMs: 100, pausaMs: 100 }), 0);
    s = sincronizar(s, 100);
    const depois = pular(s);
    expect(depois).toEqual(s);
    expect(depois.phase).toBe("overlay");
  });

  it("usa 25/5/15 como duração padrão", () => {
    expect(FOCO_MS).toBe(25 * 60 * 1000);
    expect(PAUSA_MS).toBe(5 * 60 * 1000);
    expect(PAUSA_LONGA_MS).toBe(15 * 60 * 1000);
  });
});
