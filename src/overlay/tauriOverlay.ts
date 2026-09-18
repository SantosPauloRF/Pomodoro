import { invoke } from "@tauri-apps/api/core";
import { emit, listen } from "@tauri-apps/api/event";
import type { InstantaneoFlutuante } from "../domain/instantaneo";
import type { Mode } from "../types/timer";

const EVENTO_INSTANTANEO = "pomodoro-instantaneo";
const EVENTO_COMANDO = "pomodoro-comando-flutuante";
const CANAL_COMANDO = "pomodoro.comando-flutuante";

export type ComandoFlutuante = "iniciar" | "pausar";

export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function recadoDoOverlay(): string | null {
  const injetado = window.__POMODORO_RECADO__;
  if (typeof injetado === "string" && injetado.trim() !== "") {
    return injetado;
  }
  return null;
}

export async function abrirOverlayNativo(
  motivo: Mode,
  recado: string | null = null,
): Promise<void> {
  await invoke("abrir_overlay", { motivo, recado });
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

export async function emitirInstantaneo(
  snap: InstantaneoFlutuante,
): Promise<void> {
  await emit(EVENTO_INSTANTANEO, snap);
}

export function aoInstantaneo(
  cb: (snap: InstantaneoFlutuante) => void,
): Promise<() => void> {
  return listen<InstantaneoFlutuante>(EVENTO_INSTANTANEO, (evento) => {
    cb(evento.payload);
  });
}

export function aoDispensarOverlay(cb: () => void): Promise<() => void> {
  return listen("overlay-dispensado", () => {
    cb();
  });
}

function ehComando(valor: unknown): valor is ComandoFlutuante {
  return valor === "iniciar" || valor === "pausar";
}

export function emitirComandoFlutuante(comando: ComandoFlutuante): void {
  if (typeof BroadcastChannel !== "undefined") {
    const canal = new BroadcastChannel(CANAL_COMANDO);
    canal.postMessage(comando);
    canal.close();
  }
  if (isTauri()) {
    void emit(EVENTO_COMANDO, comando);
  }
}

export function observarComandoFlutuante(
  cb: (comando: ComandoFlutuante) => void,
): () => void {
  const canal =
    typeof BroadcastChannel === "undefined"
      ? null
      : new BroadcastChannel(CANAL_COMANDO);
  if (canal) {
    canal.onmessage = (evento: MessageEvent<unknown>) => {
      if (ehComando(evento.data)) {
        cb(evento.data);
      }
    };
  }

  let ativo = true;
  let unlisten: (() => void) | undefined;
  if (isTauri()) {
    void listen<ComandoFlutuante>(EVENTO_COMANDO, (evento) => {
      if (ehComando(evento.payload)) {
        cb(evento.payload);
      }
    }).then((fn) => {
      if (ativo) {
        unlisten = fn;
      } else {
        fn();
      }
    });
  }

  return () => {
    ativo = false;
    canal?.close();
    unlisten?.();
  };
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
