---
name: registrar-escolhas
description: >-
  Grava escolhas do Pomodoro no arquivo canônico na mesma sessão. Use
  proactively when the user decides stack, timer, persistência, UI, Trello,
  convenção, diz que a regra é global ou só deste projeto, or pede para
  registrar / documentar / lembrar uma decisão.
---

# Registrar escolhas (Pomodoro)

O chat **não** é a fonte da verdade. Na mesma sessão em que o usuário decidir, persistir.

Mapa de arquivos: skill `mapa-globais`. Lei curta: [AGENTS.md](../../../AGENTS.md).

## Passos

1. Extrair a decisão em uma frase (palavras do usuário; não suavizar).
2. Classificar:

| Sinal | Destino |
|-------|---------|
| Trello: colunas, labels, checklists, never-move, Branch de card | `C:\Users\santo\.cursor\AGENTS.md` + Changelog de lá |
| Código: testes, Husky, CI, env, one-shot, DoD | `C:\Users\santo\.cursor\AGENTS-codigo.md` + Changelog de lá |
| UI e o usuário disse **global** | `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md` + Changelog de lá |
| Lei deste app (“não faça X”, stack, escopo) | `AGENTS.md` deste repo → bloco Decisões + Changelog |
| Como fazer um fluxo deste app | Skill `.cursor/skills/<nome>/SKILL.md` (+ `Skills.md` se for skill nova) |
| Produto/timer/persistência deste app | `.cursor/skills/produto-pomodoro/SKILL.md` e, se for “não reabrir”, também `AGENTS.md` |

3. Editar o destino. Changelog com a data de hoje.
4. **Não** copiar o texto global para o repo. No máximo: “vale o arquivo X”.
5. Skill nova: pasta `.cursor/skills/<kebab>/SKILL.md`, frontmatter `name` + `description` (terceira pessoa, WHAT + WHEN), corpo com menos de 500 linhas. Sem `disable-model-invocation`. Nos exemplos da skill, paths com `/`.
6. Subagente novo (só se o usuário pedir): `.cursor/agents/<nome>.md` neste repo, não em `~/.cursor/agents/`.
7. Responder: path + frase gravada + TBDs que continuam.

## Não gravar

- Preferência solta (“talvez Vite”) — confirmar se é decisão.
- Segredo, `.env` real, senha.
- Procedimento que já está no global (não duplicar).
- Board/prefixo Trello inventado. Prefixos só depois do usuário combinar.

## Ambiguidade

Se não ficar claro se é global ou só Pomodoro: **perguntar uma vez**. Não gravar nos dois lugares.
