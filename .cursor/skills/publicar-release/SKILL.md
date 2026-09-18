---
name: publicar-release
description: >-
  Publica uma versão nova do Pomodoro (bump, build assinado, latest.json,
  GitHub Release). Use when the user asks to publish a release, soltar
  versão, gerar atualização, or fazer os 4 passos do updater.
---

# Publicar release (Pomodoro)

Lei: [AGENTS.md](../../../AGENTS.md) decisão 17. Plano: [PLANEJAMENTO-ATUALIZACAO.md](../../../PLANEJAMENTO-ATUALIZACAO.md).

Quando o usuário pedir **publicar release**, fazer **os 4 passos**. Não pedir para ele anexar arquivos no site.

Commit da versão: **não**, salvo pedido explícito.

## Passos

1. **Versão.** Patch (`x.y.Z+1`) salvo o usuário pedir outro número. Iguais em `package.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml` e no crate `pomodoro` em `src-tauri/Cargo.lock`.
2. **Build assinado.** Chave em `.tauri-updater.key` (fora do git). O `tauri build` lê `TAURI_SIGNING_PRIVATE_KEY` (conteúdo do arquivo), **não** `_PATH`. `CARGO_TARGET_DIR` = `src-tauri/target` do repo.

```bash
export CARGO_TARGET_DIR="$PWD/src-tauri/target"
export TAURI_SIGNING_PRIVATE_KEY="$(cat .tauri-updater.key)"
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""
npm run tauri build
```

3. **`latest.json`** em `src-tauri/target/release/bundle/nsis/` (nome exato). `signature` = texto do `.sig` novo. URL:

`https://github.com/SantosPauloRF/Pomodoro/releases/download/vX.Y.Z/Pomodoro_X.Y.Z_x64-setup.exe`

Notas: o que o usuário disser; senão “Atualização do Pomodoro.”

4. **GitHub Release.** `gh release create` (MCP GitHub se estiver autenticado). Tag `vX.Y.Z`, título a versão, **sem** draft/pre-release. Anexar **só** os três do número novo:

- `Pomodoro_X.Y.Z_x64-setup.exe`
- `Pomodoro_X.Y.Z_x64-setup.exe.sig`
- `latest.json`

Confirmar `https://github.com/SantosPauloRF/Pomodoro/releases/latest/download/latest.json` com a versão nova. Devolver a URL do Release.

Se `gh` / MCP não autenticar: parar e pedir login. Não abrir o site do GitHub para clicar no lugar do usuário, salvo pedido.

## Não fazer

- Instalar o `.exe` novo neste PC (quem já tem o app deve **reabrir** o instalado).
- Commitir `.tauri-updater.key` ou o instalador.
- Workflow GitHub Actions, salvo pedido.
