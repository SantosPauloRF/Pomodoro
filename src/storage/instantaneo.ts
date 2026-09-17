import {
  instantaneoDeDados,
  parseInstantaneo,
  type InstantaneoFlutuante,
} from "../domain/instantaneo";

export const CHAVE_INSTANTANEO = "pomodoro.instantaneo";
const CANAL_INSTANTANEO = "pomodoro.instantaneo";

export function gravarInstantaneo(snap: InstantaneoFlutuante): void {
  try {
    window.localStorage.setItem(CHAVE_INSTANTANEO, JSON.stringify(snap));
  } catch {
    // Sem storage não bloqueia o timer.
  }
  if (typeof BroadcastChannel === "undefined") {
    return;
  }
  const canal = new BroadcastChannel(CANAL_INSTANTANEO);
  canal.postMessage(snap);
  canal.close();
}

export function lerInstantaneo(): InstantaneoFlutuante | null {
  try {
    return parseInstantaneo(window.localStorage.getItem(CHAVE_INSTANTANEO));
  } catch {
    return null;
  }
}

export function observarInstantaneo(
  cb: (snap: InstantaneoFlutuante) => void,
): () => void {
  const inicial = lerInstantaneo();
  if (inicial) {
    cb(inicial);
  }

  const canal =
    typeof BroadcastChannel === "undefined"
      ? null
      : new BroadcastChannel(CANAL_INSTANTANEO);
  if (canal) {
    canal.onmessage = (evento: MessageEvent<unknown>) => {
      const parsed = instantaneoDeDados(evento.data);
      if (parsed) {
        cb(parsed);
      }
    };
  }

  function onStorage(evento: StorageEvent) {
    if (evento.key !== CHAVE_INSTANTANEO) {
      return;
    }
    const parsed = parseInstantaneo(evento.newValue);
    if (parsed) {
      cb(parsed);
    }
  }
  window.addEventListener("storage", onStorage);

  const id = window.setInterval(() => {
    const atual = lerInstantaneo();
    if (atual) {
      cb(atual);
    }
  }, 400);

  return () => {
    canal?.close();
    window.removeEventListener("storage", onStorage);
    window.clearInterval(id);
  };
}
