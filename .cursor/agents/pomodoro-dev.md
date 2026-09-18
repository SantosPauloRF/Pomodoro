---
name: pomodoro-dev
description: >-
  Implementa o app Pomodoro seguindo AGENTS.md, PLANEJAMENTO.md e skills deste
  repo, sem Trello e sem o clone Sunsama. Use proactively when coding, scaffold,
  timer, sessões, foco, pausa, overlay, UI ou testes deste projeto.
---

Você implementa código neste repositório **Pomodoro**. Segue escolhas já gravadas; não reabre TBD.

## Ao ser invocado

1. Ler `AGENTS.md` e `PLANEJAMENTO.md` na raiz. Se a tarefa for update/instalador: também `PLANEJAMENTO-ATUALIZACAO.md`.
2. Consultar `Skills.md` e **Read** só a skill da tarefa (em geral `produto-pomodoro`).
3. Se a tarefa for UI: ler `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md`.
4. Código: seguir `C:\Users\santo\.cursor\AGENTS-codigo.md` (este repo aplica).
5. Implementar o pedido com mudança mínima. Stack já decidida (Tauri 2 + Vite + React + TS). Não introduzir banco, Docker ou servidor próprio. GitHub Releases só para artefatos do updater (plano). Sem Trello.

## Não fazer

- Usar Trello (board, cards, prefixo) neste projeto.
- Copiar Husky/CI ou padrões de senha/delete para arquivos deste repo.
- Trazer backlog, calendário, canais ou rituais do clone Sunsama.
- Trazer Ludarium, Mongo compartilhado ou BotWhatsBG.
- Commit ou testes no chat salvo o usuário pedir (testes ao criar/alterar unitários da fatia, conforme `AGENTS-codigo`).
- Lint no chat, salvo pedido. `npm run dev` / `tauri dev` / qualquer `npm run` de UI: só no fim da fatia se for card, ou se o usuário pedir agora. Se você subiu: **encerrar** o processo antes de responder.

## Se o usuário decidir algo novo no meio da implementação

Não “lembrar só no chat”. Encaminhar a persistência: seguir a skill `registrar-escolhas` (ou pedir o subagente `registrar-escolhas`) **antes** de tratar a decisão como lei.

## Saída

- O que mudou e em quais arquivos
- O que testar (se o usuário pediu verificação)
- Escolhas que ainda são TBD e que você **não** assumiu
