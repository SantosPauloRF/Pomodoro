---
name: produto-pomodoro
description: >-
  Decisões de produto e stack do app Pomodoro (timer, sessões, foco/pausa,
  persistência, escopo). Use when implementing or discussing the timer,
  sessions, focus, breaks, durations, storage, stack, or product scope.
---

# Produto Pomodoro

Lei curta: [AGENTS.md](../../../AGENTS.md). Plano e fatias: [PLANEJAMENTO.md](../../../PLANEJAMENTO.md). Escolha nova: skill `registrar-escolhas`.

## Escopo

- App **dedicado** a Pomodoro (foco / pausa), programa **Windows**.
- **Não** é o planner Sunsama (`sunsuma clone`): sem board de dias, backlog, canais, timebox de calendário ou rituais, salvo pedido explícito.
- **Não** é Ludarium / catálogo / BotWhatsBG.
- **Não** usa Trello.

## Stack — decidida

Tauri 2 + Vite + React + TypeScript. Janela nativa; `tauri build` gera `.exe` / instalador. Sem Next.js.

Não introduzir banco, fila, Docker ou provedor de deploy. Electron só se Rust/`rustup` for bloqueio (pedido explícito).

| Item | Estado |
|------|--------|
| UI / bundler | Vite + React |
| Linguagem | TypeScript (UI); Rust só no shell Tauri |
| Persistência | Durações do ciclo no `localStorage` da janela |
| Auth | Sem login |
| Deploy | `.exe` / instalador Tauri no Windows |
| Trello | Não se aplica |

Instalador: `npm run tauri build` → NSIS em `src-tauri/target/release/bundle/nsis/`. Última página sugere **atalho na área de trabalho** (marcado). Atalho no Menu Iniciar é criado. **Barra de tarefas:** o Windows não permite o instalador fixar; o usuário fixa pelo Menu Iniciar ou pelo ícone depois de abrir o app.

## Timer

- Modos: **foco**, **pausa** (curta) e **pausa longa**. Iniciar, pausar, resetar.
- Relógio de parede (`Date.now`), não só `setInterval`.
- Resetar: volta o tempo cheio do modo atual; **não** troca de modo nem o passo do ciclo; **não** abre overlay.
- Ao zerar: overlay (abaixo). O próximo modo **não** começa sozinho.
- Ciclo fixo: foco + pausa **3 vezes**, depois o **4º foco** e uma **pausa longa**; em seguida recomeça.
- Durações **editáveis** na tela de configuração. Valores iniciais: 25 min foco / 5 min pausa / 15 min pausa longa. Não são lei.

### Minimizar

- Ao minimizar a janela principal **ou clicar fora dela**: esconder o app e mostrar um **ícone flutuante** (always-on-top).
- O ícone é **arrastável**, tomate com relógio, **sem fundo branco de janela**. Clique (sem arrastar) restaura a janela principal.
- No flutuante: **anel de progresso** em volta de **todo** o widget (cor do modo: coral / verde / ouro); interior do círculo com backdrop **50% transparente** igual ao overlay ao zerar (`rgba(16, 20, 28, 0.5)`); no centro o tomate, **horário atual**, **dia da semana** (curto) e **dia do mês**; **play** embaixo por cima do círculo (vira **pause** com o timer rodando). Clique no ícone (sem arrastar) restaura a janela; play/pause não restaura.
- Ao zerar o timer, o backdrop abre **mesmo minimizado**; o flutuante some e a janela principal volta. Escape ou Entendi dispensa.

### Ao zerar (interruptor)

- Cobre **todos** os monitores (tamanho da tela do Windows, incluindo a barra de tarefas).
- Backdrop **50% transparente**, com **animação ao abrir**.
- Fim do foco: copy em português pedindo para **parar**. Fim da pausa: pedir para **voltar ao foco**.
- Som de alerta ao aparecer. Padrão até o usuário decidir: **um toque** + overlay parado até dispensar (loop = TBD).
- **Entendi** fecha o overlay e mostra a tela do **próximo modo parado** (iniciar pausa / iniciar foco). Não começa sozinho.
- **Pular** (na tela do timer): avança foco ou pausa sem esperar o tempo; não abre overlay.

## UI deste app

- Copy em **português**.
- Padrões globais de senha/delete: skill `ui-padroes` **quando** houver esses fluxos.
- Ícone do app e do flutuante: **tomate com relógio** (`src/assets/icone-pomodoro.png`).
- Visual da janela (decidido): fundo `#10141c`, acento coral `#ff6b4a`, anel de progresso, cartões laterais (ciclo / pular), botão-pílula, chips de pausa. Copy em **português**. Sem inventar sessão/streak.

## Como evoluir esta skill

Toda decisão de produto confirmada vira um item **decidido** (não TBD) nesta página. Se for “não reabrir”, copiar uma linha para `AGENTS.md`. Atualizar [PLANEJAMENTO.md](../../../PLANEJAMENTO.md) se mudar MVP ou ordem de fatias.
