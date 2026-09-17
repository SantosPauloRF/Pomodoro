---
name: produto-pomodoro
description: >-
  Decisões de produto e stack do app Pomodoro (timer, sessões, foco/pausa,
  persistência, escopo). Use when implementing or discussing the timer,
  sessions, focus, breaks, durations, storage, stack, or product scope.
---

# Produto Pomodoro

Lei curta: [AGENTS.md](../../../AGENTS.md). Escolha nova: skill `registrar-escolhas`.

Repo ainda **sem código de app**. Não assumir stack nem durações até constarem abaixo como decididas.

## Escopo

- App **dedicado** a Pomodoro (foco / pausa).
- **Não** é o planner Sunsama (`sunsuma clone`): sem board de dias, backlog, canais, timebox de calendário ou rituais, salvo pedido explícito.
- **Não** é Ludarium / catálogo / BotWhatsBG.

## Stack — TBD

Ainda não escolhida. Até o usuário decidir:

- Não introduzir framework, bundler, banco, fila, Docker ou provedor de deploy “por padrão”.
- Quando escolher: gravar aqui **e** no bloco Decisões do `AGENTS.md`.

| Item | Estado |
|------|--------|
| UI / bundler | TBD |
| Linguagem | TBD |
| Persistência | TBD |
| Auth | TBD |
| Deploy | TBD |
| Prefixo/board Trello | TBD |

## Timer — TBD

Não gravar 25/5 (ou outras durações) como lei até o usuário confirmar.

Quando decidir, registrar no mínimo:

- Duração do foco e da pausa curta (e pausa longa, se houver)
- Se o usuário pode mudar durações
- O que acontece ao zerar (som, próximo modo, log da sessão)
- Se corre em background / aba fechada

## UI deste app

- Copy em **português**.
- Padrões globais de senha/delete: skill `ui-padroes` **quando** houver esses fluxos.
- Paleta, tipografia, layout do timer: TBD — não inventar identidade visual “genérica AI” e tratar como escolhida.

## Como evoluir esta skill

Toda decisão de produto confirmada vira um item **decidido** (não TBD) nesta página. Se for “não reabrir”, copiar uma linha para `AGENTS.md`.
