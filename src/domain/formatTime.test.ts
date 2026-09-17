import { describe, expect, it } from "vitest";
import { FOCO_MS } from "../constants/timer";
import { formatarTempo } from "./formatTime";

describe("formatarTempo", () => {
  it("formata zero", () => {
    expect(formatarTempo(0)).toBe("00:00");
  });

  it("mantém 25:00 no início do foco padrão", () => {
    expect(formatarTempo(FOCO_MS)).toBe("25:00");
  });

  it("só cai o segundo depois de um segundo inteiro (ceil)", () => {
    expect(formatarTempo(FOCO_MS - 1)).toBe("25:00");
    expect(formatarTempo(FOCO_MS - 1000)).toBe("24:59");
  });
});
