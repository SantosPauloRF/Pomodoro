import type { SomId } from "../domain/sons";
import { sintetizarSom } from "./sintese";
import calmUrl from "../assets/sons/Calm.ogg?url";
import chordUrl from "../assets/sons/Chord.ogg?url";
import doorbellUrl from "../assets/sons/Doorbell.ogg?url";
import harpUrl from "../assets/sons/Enharpment.ogg?url";
import glassUrl from "../assets/sons/Glass.ogg?url";
import bellUrl from "../assets/sons/Information_Bell.ogg?url";
import kotoUrl from "../assets/sons/Koto.ogg?url";
import woodUrl from "../assets/sons/Woodblock.ogg?url";

const ARQUIVO: Partial<Record<SomId, string>> = {
  ntf_calm: calmUrl,
  ntf_chord: chordUrl,
  ntf_doorbell: doorbellUrl,
  ntf_harp: harpUrl,
  ntf_glass: glassUrl,
  ntf_bell: bellUrl,
  ntf_koto: kotoUrl,
  ntf_wood: woodUrl,
};

const cache = new Map<SomId, AudioBuffer | null>();
const inflight = new Map<SomId, Promise<AudioBuffer | null>>();

export async function bufferDoSom(
  ctx: AudioContext,
  id: SomId,
): Promise<AudioBuffer | null> {
  if (id === "silencio") {
    return null;
  }
  const pronto = cache.get(id);
  if (pronto !== undefined) {
    return pronto;
  }
  const pendente = inflight.get(id);
  if (pendente) {
    return pendente;
  }
  const sintetico = sintetizarSom(ctx, id);
  if (sintetico) {
    cache.set(id, sintetico);
    return sintetico;
  }
  const url = ARQUIVO[id];
  if (!url) {
    cache.set(id, null);
    return null;
  }
  const carga = (async () => {
    try {
      const resposta = await fetch(url);
      if (!resposta.ok) {
        cache.set(id, null);
        return null;
      }
      const bytes = await resposta.arrayBuffer();
      const buffer = await ctx.decodeAudioData(bytes.slice(0));
      cache.set(id, buffer);
      return buffer;
    } catch {
      cache.set(id, null);
      return null;
    } finally {
      inflight.delete(id);
    }
  })();
  inflight.set(id, carga);
  return carga;
}
