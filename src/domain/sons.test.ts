import { describe, expect, it } from "vitest";
import { normalizarSomModo, somIdValido, somModoPadrao } from "./sons";

describe("pacote de sons", () => {
  it("usa Beep como padrão", () => {
    expect(somModoPadrao().somId).toBe("beep");
  });

  it("aceita clássicos, notificações e Nenhum", () => {
    expect(somIdValido("beep")).toBe(true);
    expect(somIdValido("ntf_doorbell")).toBe(true);
    expect(somIdValido("silencio")).toBe(true);
    expect(somIdValido("confirmation")).toBe(false);
  });

  it("mapeia ids do Kenney removido para os clássicos", () => {
    expect(normalizarSomModo({ somId: "confirmation" }).somId).toBe("beep");
    expect(normalizarSomModo({ somId: "bong", altura: 50, loop: true })).toEqual({
      somId: "sino",
      altura: 50,
      loop: true,
    });
    expect(normalizarSomModo({ somId: "glitch" }).somId).toBe("digital");
    expect(normalizarSomModo({ somId: "error" }).somId).toBe("alerta");
  });
});
