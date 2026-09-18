# Pomodoro

Timer de **foco / pausa** para Windows: janela nativa (Tauri 2 + Vite + React + TypeScript). Ciclo de 4 focos (3 pausas curtas + 1 pausa longa). Ao zerar, um backdrop cobre todos os monitores e toca um alerta. Durações na tela **Configurações**. Ao minimizar, um ícone flutuante arrastável reabre o app.

## Pré-requisitos

- Node.js 24 (npm)
- [rustup](https://www.rust-lang.org/tools/install) (toolchain stable)
- No Windows: [Build Tools do Visual Studio](https://tauri.app/start/prerequisites/) com workload de C++ e WebView2 (já vem no Windows 10/11 atual)

Não há `.env` de app (sem login/banco). Para **assinar** o updater no `tauri build`, use `TAURI_SIGNING_PRIVATE_KEY` (caminho ou conteúdo da chave **privada**, fora do git).

## Como rodar em local

```bash
npm install
npm run tauri dev
```

Isso abre o programa em janela nativa. Só o frontend no navegador (útil para Playwright): `npm run dev` em `http://localhost:1420`.

Se aparecer `cargo ... program not found`, o rustup está instalado mas o terminal ainda não viu o PATH. Rode de novo `npm run tauri dev` (o script inclui `~/.cargo/bin`). Se o Cursor foi aberto antes do rustup, feche e abra o Cursor.

## Instalador / .exe

Na pasta do projeto:

```bash
npm install
npm run tauri build
```

O updater está ligado: o `tauri build` **precisa** da chave privada (veja a seção seguinte). Sem ela a build falha.

Isso gera o instalável NSIS em:

`src-tauri/target/release/bundle/nsis/`

O arquivo costuma se chamar algo como `Pomodoro_0.1.0_x64-setup.exe`. Rode esse `.exe` para instalar.

Na instalação:

1. O instalador cria atalho no **Menu Iniciar**.
2. Na **última página**, há a opção **Criar atalho na área de trabalho** — vem marcada; desmarque se não quiser.
3. Há também a opção de **abrir o app** ao terminar.

**Barra de tarefas:** o Windows 10/11 não deixa o instalador fixar o programa na barra. Depois de instalar (e, se quiser, abrir o app), clique com o botão direito no ícone na barra de tarefas → **Fixar na barra de tarefas**, ou no atalho do Menu Iniciar → **Mais** → **Fixar na barra de tarefas**.

A primeira build baixa o compilador Rust e o WebView2 bootstrapper se faltar; pode demorar vários minutos.

## Publicar atualização (PCs já instalados)

O app instalado, **ao abrir** (com internet), consulta o GitHub Releases. Se a versão remota for maior, pede **Atualizar** ou **Agora não**. Recusar continua na versão atual e pergunta de novo na próxima abertura.

1. Suba o número da versão em `package.json`, `src-tauri/tauri.conf.json` e `src-tauri/Cargo.toml` (os três iguais).
2. Na pasta do projeto (a chave privada está em `.tauri-updater.key`, **não** vai para o git — faça backup). O `tauri build` lê **`TAURI_SIGNING_PRIVATE_KEY`** (não `_PATH`).

Git Bash:

```bash
export TAURI_SIGNING_PRIVATE_KEY="$(cat .tauri-updater.key)"
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""
npm run tauri build
```

PowerShell:

```powershell
$env:TAURI_SIGNING_PRIVATE_KEY = Get-Content -Raw .tauri-updater.key
$env:TAURI_SIGNING_PRIVATE_KEY_PASSWORD = ""
npm run tauri build
```

3. Crie um **GitHub Release** com a tag `vX.Y.Z` (mesma versão). Anexe:
   - o instalador `Pomodoro_X.Y.Z_x64-setup.exe`
   - o arquivo `.sig` gerado ao lado dele
   - um `latest.json` com o nome **exato** `latest.json`

Exemplo de `latest.json` (a `signature` é o **texto** do `.sig`, não um caminho):

```json
{
  "version": "0.2.0",
  "notes": "O que mudou nesta versão.",
  "pub_date": "2026-09-18T12:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "CONTEUDO-DO-ARQUIVO.sig",
      "url": "https://github.com/SantosPauloRF/Pomodoro/releases/download/v0.2.0/Pomodoro_0.2.0_x64-setup.exe"
    }
  }
}
```

O app lê `https://github.com/SantosPauloRF/Pomodoro/releases/latest/download/latest.json`.

PC **offline**: não vê o aviso. `.exe` copiado à mão (sem este instalador) **não** atualiza por esse canal.

## Comandos

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Vite na porta 1420 |
| `npm run tauri dev` | App Windows em desenvolvimento |
| `npm run tauri build` | Build + instalador NSIS |
| `npm test` | Testes unitários (Vitest) |
| `npm run test:e2e` | E2E Playwright (UI no Vite) |
| `npm run lint` | ESLint |
| `npm run build` | `tsc` + bundle de produção |

`git commit` dispara Husky (`npm run lint && npm test`). A suíte E2E **não** roda no hook; use `npm run test:e2e` quando quiser.

CI na `main`: lint + unitários (sem E2E e sem `tauri build`).
