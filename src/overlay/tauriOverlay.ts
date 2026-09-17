import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { Mode } from "../types/timer";

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export async function abrirOverlayNativo(motivo: Mode): Promise<void> {
  await invoke("abrir_overlay", { motivo });
}

export async function fecharOverlayNativo(): Promise<void> {
  await invoke("fechar_overlay");
}

export async function mostrarFlutuante(): Promise<void> {
  await invoke("mostrar_flutuante");
}

export async function restaurarPrincipal(): Promise<void> {
  await invoke("restaurar_principal");
}

export function aoDispensarOverlay(cb: () => void): Promise<() => void> {
  return listen("overlay-dispensado", () => {
    cb();
  });
}

export function motivoDoOverlay(): Mode {
  const injetado = window.__POMODORO_MOTIVO__;
  if (
    injetado === "pausaLonga" ||
    injetado === "pausa" ||
    injetado === "foco"
  ) {
    return injetado;
  }
  const hash = window.location.hash.replace("#", "");
  if (hash === "pausaLonga" || hash === "pausa") {
    return hash;
  }
  return "foco";
}
