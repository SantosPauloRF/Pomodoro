import type { SomId } from "../domain/sons";

const DURACAO_S = 0.62;

function bufferDe(
  ctx: AudioContext,
  preencher: (data: Float32Array, sr: number) => void,
  duracao = DURACAO_S,
): AudioBuffer {
  const sr = ctx.sampleRate;
  const n = Math.max(1, Math.floor(sr * duracao));
  const buffer = ctx.createBuffer(1, n, sr);
  preencher(buffer.getChannelData(0), sr);
  return buffer;
}

function seno(t: number, hz: number): number {
  return Math.sin(2 * Math.PI * hz * t);
}

function envDecai(t: number, vel: number): number {
  return Math.exp(-t * vel);
}

export function sintetizarSom(ctx: AudioContext, id: SomId): AudioBuffer | null {
  if (id === "beep") {
    return bufferDe(ctx, (data, sr) => {
      for (let i = 0; i < data.length; i++) {
        const t = i / sr;
        data[i] = seno(t, 880) * envDecai(t, 6) * 0.85;
      }
    });
  }
  if (id === "sino") {
    return bufferDe(
      ctx,
      (data, sr) => {
        for (let i = 0; i < data.length; i++) {
          const t = i / sr;
          const tom =
            seno(t, 523.25) * envDecai(t, 3.2) + seno(t, 784.0) * envDecai(t, 4.1) * 0.55;
          data[i] = tom * 0.55;
        }
      },
      0.9,
    );
  }
  if (id === "digital") {
    return bufferDe(ctx, (data, sr) => {
      for (let i = 0; i < data.length; i++) {
        const t = i / sr;
        const quad = Math.sign(seno(t, 659.25));
        data[i] = quad * envDecai(t, 8) * 0.22;
      }
    });
  }
  if (id === "suave") {
    return bufferDe(
      ctx,
      (data, sr) => {
        for (let i = 0; i < data.length; i++) {
          const t = i / sr;
          data[i] = seno(t, 349.23) * envDecai(t, 2.4) * 0.7;
        }
      },
      0.85,
    );
  }
  if (id === "madeira") {
    return bufferDe(
      ctx,
      (data, sr) => {
        let prev = 0;
        for (let i = 0; i < data.length; i++) {
          const t = i / sr;
          const ruido = Math.random() * 2 - 1;
          prev = prev * 0.6 + ruido * 0.4;
          data[i] = prev * envDecai(t, 18) * 0.9;
        }
      },
      0.28,
    );
  }
  if (id === "alerta") {
    return bufferDe(
      ctx,
      (data, sr) => {
        const meio = data.length / 2;
        for (let i = 0; i < data.length; i++) {
          const t = i / sr;
          const hz = i < meio ? 880 : 659.25;
          const local = i < meio ? t : t - meio / sr;
          data[i] = seno(t, hz) * envDecai(local, 7) * 0.8;
        }
      },
      0.7,
    );
  }
  return null;
}
