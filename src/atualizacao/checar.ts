import type { Update } from "@tauri-apps/plugin-updater";

export type AtualizacaoEncontrada = {
  versao: string;
  notas: string;
  update: Update;
};

export async function checarAtualizacao(): Promise<AtualizacaoEncontrada | null> {
  const { check } = await import("@tauri-apps/plugin-updater");
  const update = await check();
  if (!update) {
    return null;
  }
  return {
    versao: update.version,
    notas: update.body?.trim() ?? "",
    update,
  };
}

export async function baixarEInstalar(update: Update): Promise<void> {
  await update.downloadAndInstall();
  const { relaunch } = await import("@tauri-apps/plugin-process");
  await relaunch();
}
