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
| Persistência | Nenhuma no MVP |
| Auth | Sem login |
| Deploy | `.exe` / instalador Tauri no Windows |
| Trello | Não se aplica |

## Timer

- Modos: **foco** e **pausa**. Iniciar, pausar, resetar.
- Relógio de parede (`Date.now`), não só `setInterval`.
- Resetar: volta o tempo cheio do modo atual; **não** troca de modo; **não** abre overlay.
- Ao zerar: overlay (abaixo). O próximo modo **não** começa sozinho.
- Durações: **não são lei**. Valores iniciais no código: 25 min foco / 5 min pausa. Sem pausa longa no MVP. Sem durações editáveis no MVP.

### Ao zerar (interruptor)

- Uma janela por **todos** os monitores: fullscreen, always-on-top, backdrop escuro (cobre a barra de tarefas).
- Fim do foco: copy em português pedindo para **parar**. Fim da pausa: pedir para **voltar ao foco**.
- Som de alerta ao aparecer. Padrão até o usuário decidir: **um toque** + overlay parado até dispensar (loop = TBD).
- Botão para dispensar. Sem toast do Windows.

## UI deste app

- Copy em **português**.
- Padrões globais de senha/delete: skill `ui-padroes` **quando** houver esses fluxos.
- Paleta, tipografia, layout do timer: TBD — não inventar identidade visual “genérica AI” e tratar como escolhida. Overlay: contraste alto.

## Como evoluir esta skill

Toda decisão de produto confirmada vira um item **decidido** (não TBD) nesta página. Se for “não reabrir”, copiar uma linha para `AGENTS.md`. Atualizar [PLANEJAMENTO.md](../../../PLANEJAMENTO.md) se mudar MVP ou ordem de fatias.
