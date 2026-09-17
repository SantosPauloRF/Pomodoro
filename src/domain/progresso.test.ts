import { describe, expect, it } from "vitest";
import { progressoRestante } from "./progresso";

describe("progressoRestante", () => {
  it("é 1 no início do modo", () => {
    expect(progressoRestante(25_000, 25_000)).toBe(1);
  });

  it("é 0 quando o tempo acaba", () => {
    expect(progressoRestante(0, 25_000)).toBe(0);
  });

  it("fica no meio quando resta metade", () => {
    expect(progressoRestante(12_500, 25_000)).toBe(0.5);
  });
});
