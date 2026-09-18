/// <reference types="vite/client" />

declare module "*.wav?url" {
  const src: string;
  export default src;
}

declare module "*.ogg?url" {
  const src: string;
  export default src;
}

interface Window {
  __TAURI_INTERNALS__?: unknown;
  __POMODORO_MOTIVO__?: "foco" | "pausa" | "pausaLonga";
  __POMODORO_RECADO__?: string | null;
}
