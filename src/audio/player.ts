import type { SomModo } from "../domain/sons";
import { bufferDoSom } from "./pacote";

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let fonteAtiva: AudioBufferSourceNode | null = null;
let ganhoAtivo: GainNode | null = null;
let geracao = 0;

function contexto(): AudioContext | null {
  if (ctx) {
    return ctx;
  }
  const AudioCtx =
    window.AudioContext || (window as AudioWindow).webkitAudioContext;
  if (!AudioCtx) {
    return null;
  }
  ctx = new AudioCtx();
  return ctx;
}

export async function prepararAudio(): Promise<void> {
  const ac = contexto();
  if (!ac) {
    return;
  }
  try {
    await ac.resume();
  } catch {
    // Sem gesto do usuário o overlay ainda abre.
  }
}

export function pararSomOverlay(): void {
  geracao += 1;
  if (fonteAtiva) {
    try {
      fonteAtiva.stop();
    } catch {
      // Já parou.
    }
    fonteAtiva.disconnect();
    fonteAtiva = null;
  }
  if (ganhoAtivo) {
    ganhoAtivo.disconnect();
    ganhoAtivo = null;
  }
}

export async function tocarSomOverlay(modo: SomModo): Promise<void> {
  pararSomOverlay();
  if (modo.somId === "silencio" || modo.altura <= 0) {
    return;
  }
  const este = geracao;
  const ac = contexto();
  if (!ac) {
    return;
  }
  try {
    await ac.resume();
    const buffer = await bufferDoSom(ac, modo.somId);
    if (este !== geracao || !buffer) {
      return;
    }
    const ganho = ac.createGain();
    ganho.gain.value = modo.altura / 100;
    ganho.connect(ac.destination);
    const fonte = ac.createBufferSource();
    fonte.buffer = buffer;
    fonte.loop = modo.loop;
    fonte.connect(ganho);
    fonte.onended = () => {
      if (fonteAtiva === fonte) {
        fonteAtiva = null;
      }
    };
    fonte.start();
    fonteAtiva = fonte;
    ganhoAtivo = ganho;
  } catch {
    if (este === geracao) {
      pararSomOverlay();
    }
  }
}
