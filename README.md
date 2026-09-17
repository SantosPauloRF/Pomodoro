# Pomodoro

Timer de **foco / pausa** para Windows: janela nativa (Tauri 2 + Vite + React + TypeScript). Ciclo de 4 focos (3 pausas curtas + 1 pausa longa). Ao zerar, um backdrop cobre todos os monitores e toca um alerta. Durações na tela **Configurações**. Ao minimizar, um ícone flutuante arrastável reabre o app.

## Pré-requisitos

- Node.js 24 (npm)
- [rustup](https://www.rust-lang.org/tools/install) (toolchain stable)
- No Windows: [Build Tools do Visual Studio](https://tauri.app/start/prerequisites/) com workload de C++ e WebView2 (já vem no Windows 10/11 atual)

Não há variáveis de ambiente neste MVP (sem `.env`).

## Como rodar em local

```bash
npm install
npm run tauri dev
```

Isso abre o programa em janela nativa. Só o frontend no navegador (útil para Playwright): `npm run dev` em `http://localhost:1420`.

Se aparecer `cargo ... program not found`, o rustup está instalado mas o terminal ainda não viu o PATH. Rode de novo `npm run tauri dev` (o script inclui `~/.cargo/bin`). Se o Cursor foi aberto antes do rustup, feche e abra o Cursor.

## Instalador / .exe

```bash
npm run tauri build
```

O NSIS gera o instalador em `src-tauri/target/release/bundle/nsis/`.

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
