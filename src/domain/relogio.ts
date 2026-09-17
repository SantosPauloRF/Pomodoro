const DIAS_SEMANA_CURTOS = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sáb",
] as const;

export type RelogioFlutuante = {
  hora: string;
  data: string;
};

function doisDigitos(valor: number): string {
  return String(valor).padStart(2, "0");
}

export function formatarRelogioFlutuante(agora: Date): RelogioFlutuante {
  return {
    hora: `${doisDigitos(agora.getHours())}:${doisDigitos(agora.getMinutes())}`,
    data: `${DIAS_SEMANA_CURTOS[agora.getDay()]} ${agora.getDate()}`,
  };
}
