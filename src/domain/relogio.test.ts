import { describe, expect, it } from "vitest";
import { formatarRelogioFlutuante } from "./relogio";

describe("formatarRelogioFlutuante", () => {
  it("mostra hora, dia da semana e dia do mês em português", () => {
    const agora = new Date(2026, 8, 17, 18, 7, 30);
    expect(formatarRelogioFlutuante(agora)).toEqual({
      hora: "18:07",
      data: "qui 17",
    });
  });

  it("usa domingo como primeiro dia da semana", () => {
    const agora = new Date(2026, 8, 13, 9, 5, 0);
    expect(formatarRelogioFlutuante(agora)).toEqual({
      hora: "09:05",
      data: "dom 13",
    });
  });
});
