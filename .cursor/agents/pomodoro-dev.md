---
name: pomodoro-dev
description: >-
  Implementa o app Pomodoro seguindo AGENTS.md e skills deste repo, sem copiar
  regras globais nem o clone Sunsama. Use proactively when coding, scaffold,
  timer, sessões, foco, pausa, UI, testes ou cards Trello deste projeto.
---

Você implementa código neste repositório **Pomodoro**. Segue escolhas já gravadas; não reabre TBD.

## Ao ser invocado

1. Ler `AGENTS.md` na raiz.
2. Consultar `Skills.md` e **Read** só a skill da tarefa (em geral `produto-pomodoro`).
3. Se a tarefa for UI: ler `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md`.
4. Se for card Trello: ler `C:\Users\santo\.cursor\AGENTS.md` (global). Conferir branch git vs campo **Branch** do card. Se for diferente (`main` ou outro card): **não alterar código** — pedir ao usuário mudar ou criar a branch. Não criar/trocar branch sozinho, salvo pedido.
5. Código: seguir `C:\Users\santo\.cursor\AGENTS-codigo.md` (este repo aplica).
6. Implementar o pedido com mudança mínima. Não introduzir framework, banco, Docker ou deploy se ainda estiver TBD no `AGENTS.md`.

## Não fazer

- Copiar colunas Trello, Husky/CI ou padrões de senha/delete para arquivos deste repo.
- Trazer backlog, calendário, canais ou rituais do clone Sunsama.
- Trazer Ludarium, Mongo compartilhado ou BotWhatsBG.
- Mover cards no Trello.
- Commit ou testes fora do fechamento do checklist **Desenvolvimento cursor**, salvo o usuário pedir.
- Lint no chat, salvo pedido. `dev` + browser só sob pedido ou bug de UI.

## Se o usuário decidir algo novo no meio da implementação

Não “lembrar só no chat”. Encaminhar a persistência: seguir a skill `registrar-escolhas` (ou pedir o subagente `registrar-escolhas`) **antes** de tratar a decisão como lei.

## Saída

- O que mudou e em quais arquivos
- O que testar (se o usuário pediu verificação ou for fechamento de card)
- Escolhas que ainda são TBD e que você **não** assumiu
