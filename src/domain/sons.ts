import type { Mode } from "../types/timer";

export const SONS_CLASSICOS = [
  { id: "beep", nome: "Beep" },
  { id: "sino", nome: "Sino" },
  { id: "digital", nome: "Digital" },
  { id: "suave", nome: "Suave" },
  { id: "madeira", nome: "Madeira" },
  { id: "alerta", nome: "Alerta" },
] as const;

export const SONS_GERAIS = [
  { id: "ntf_calm", nome: "Calmo" },
  { id: "ntf_chord", nome: "Acorde" },
  { id: "ntf_doorbell", nome: "Campainha" },
  { id: "ntf_harp", nome: "Harpa" },
  { id: "ntf_glass", nome: "Cristal" },
  { id: "ntf_bell", nome: "Sino de recado" },
  { id: "ntf_koto", nome: "Koto" },
  { id: "ntf_wood", nome: "Bloco" },
] as const;

export const SONS_PACOTE = [
  ...SONS_CLASSICOS,
  ...SONS_GERAIS,
  { id: "silencio", nome: "Nenhum" },
] as const;

export type SomId = (typeof SONS_PACOTE)[number]["id"];

export type SomModo = {
  somId: SomId;
  altura: number;
  loop: boolean;
};

export type SonsConfig = {
  foco: SomModo;
  pausa: SomModo;
  pausaLonga: SomModo;
};

export const ALTURA_SOM_MIN = 0;
export const ALTURA_SOM_MAX = 100;

const IDS = new Set<string>(SONS_PACOTE.map((item) => item.id));

/** Ids do Kenney que saiu do app. */
const SOM_LEGADO: Record<string, SomId> = {
  confirmation: "beep",
  maximize: "beep",
  select: "beep",
  bong: "sino",
  glitch: "digital",
  glass: "suave",
  pluck: "madeira",
  drop: "madeira",
  error: "alerta",
  question: "alerta",
};

export function somModoPadrao(): SomModo {
  return { somId: "beep", altura: 40, loop: false };
}

export function sonsPadrao(): SonsConfig {
  return {
    foco: somModoPadrao(),
    pausa: somModoPadrao(),
    pausaLonga: somModoPadrao(),
  };
}

export function somIdValido(valor: string): valor is SomId {
  return IDS.has(valor);
}

export function resolverSomId(valor: string): SomId | null {
  if (somIdValido(valor)) {
    return valor;
  }
  const legado = SOM_LEGADO[valor];
  return legado ?? null;
}

export function alturaValida(valor: number): boolean {
  return Number.isInteger(valor) && valor >= ALTURA_SOM_MIN && valor <= ALTURA_SOM_MAX;
}

export function normalizarSomModo(parcial: unknown): SomModo {
  const padrao = somModoPadrao();
  if (parcial == null || typeof parcial !== "object") {
    return padrao;
  }
  const dados = parcial as Partial<SomModo>;
  const somId =
    typeof dados.somId === "string" ? resolverSomId(dados.somId) ?? padrao.somId : padrao.somId;
  const alturaBruta = Number(dados.altura);
  const altura = alturaValida(alturaBruta) ? alturaBruta : padrao.altura;
  return {
    somId,
    altura,
    loop: dados.loop === true,
  };
}

export function parseSonsSalvos(raw: string | null): SonsConfig | null {
  if (raw == null || raw === "") {
    return null;
  }
  try {
    const dados = JSON.parse(raw) as Partial<SonsConfig>;
    return {
      foco: normalizarSomModo(dados.foco),
      pausa: normalizarSomModo(dados.pausa),
      pausaLonga: normalizarSomModo(dados.pausaLonga),
    };
  } catch {
    return null;
  }
}

export function somDoModo(config: SonsConfig, mode: Mode): SomModo {
  if (mode === "pausaLonga") {
    return config.pausaLonga;
  }
  return mode === "pausa" ? config.pausa : config.foco;
}
