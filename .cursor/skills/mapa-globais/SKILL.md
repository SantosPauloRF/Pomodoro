---
name: mapa-globais
description: >-
  Mapa do que é regra global vs decisão do repo Pomodoro. Use when deciding
  where a convention lives, when the user mentions Trello, AGENTS.md,
  AGENTS-codigo, ui-padroes, skill global, or to avoid duplicating globals.
---

# Mapa: global vs este projeto

Contexto: [AGENTS.md](../../../AGENTS.md). Persistência de escolha nova: skill `registrar-escolhas`.

## Fontes canônicas

| Camada | Path | Este repo faz o quê |
|--------|------|---------------------|
| Trello | `C:\Users\santo\.cursor\AGENTS.md` | Aplica. Não copia colunas/labels/checklists. |
| Código | `C:\Users\santo\.cursor\AGENTS-codigo.md` | Aplica (rule `.cursor/rules/codigo-organizado.mdc`). |
| UI global | `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md` | Aplica em formulário/senha/delete. |
| Subagentes globais | `C:\Users\santo\.cursor\agents\` | Vazio — não criar agente pessoal para este app. |
| Skills Cursor built-in | `~\.cursor\skills-cursor\` | Não gravar nada. |
| Skills de **outro** produto | `~\.cursor\skills\botwhatsbg-*` | Pastas vazias / outro repo — ignorar. |
| Lei Pomodoro | `AGENTS.md` (raiz) | Só decisões deste app. |
| Skills Pomodoro | `.cursor/skills/<nome>/SKILL.md` | Como fazer fluxos deste app. |
| Subagentes Pomodoro | `.cursor/agents/*.md` | `registrar-escolhas`, `pomodoro-dev`. |

## Teste rápido

- “Nunca mover card Trello” → já é global. Não repetir como skill do Pomodoro.
- “Commit só no fim do checklist Desenvolvimento cursor” → já é global (`AGENTS.md` Trello + `AGENTS-codigo`).
- “Senha com olho / modal ao deletar” → `ui-padroes`, **a menos que** o usuário diga que neste app é diferente.
- “Timer 25/5”, “Vite”, “sem login” → **deste** repo (`AGENTS.md` + `produto-pomodoro`).
- “Isso vale em todos os projetos” → arquivo **global** + changelog de lá.

## Conflito

Se um arquivo deste repo contradisser um global: vale o **global**, salvo o usuário ter gravado aqui uma exceção explícita (uma linha em `AGENTS.md`: “neste app, X em vez de Y”).
