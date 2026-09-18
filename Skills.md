# Skills.md — Pomodoro

Catálogo de skills **deste projeto**. Cada uma vive em `.cursor/skills/<nome>/SKILL.md` (não em `~/.cursor/skills-cursor/`).

## Como usar com AGENTS.md

| Arquivo | Função |
|---------|--------|
| [AGENTS.md](./AGENTS.md) | Sempre: o que o produto é, o que não reabrir, ponteiros globais |
| [PLANEJAMENTO.md](./PLANEJAMENTO.md) | Plano de produto, MVP, overlay, ordem de fatias |
| [PLANEJAMENTO-ATUALIZACAO.md](./PLANEJAMENTO-ATUALIZACAO.md) | Atualização do app instalado (GitHub Releases + updater Tauri) |
| `C:\Users\santo\.cursor\AGENTS-codigo.md` | Organização de código (este projeto aplica) |
| `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md` | UI global (senha, delete) |
| Este Skills.md | Índice: qual skill abrir |
| `.cursor/skills/*/SKILL.md` | Procedimento ou decisões de um domínio |

Neste repo **não** vale o `AGENTS.md` Trello global.

Fluxo:

1. Ler `AGENTS.md` deste repo e `PLANEJAMENTO.md`. Atualização: `PLANEJAMENTO-ATUALIZACAO.md`.
2. Abrir **só** a skill da tarefa (tabela abaixo).
3. Globais de código/UI: ler o arquivo canônico, não uma cópia.
4. Escolha nova do usuário → skill `registrar-escolhas` (persistir na hora).

## Skills neste repo

| Skill | Pasta | Usar quando |
|-------|--------|-------------|
| `mapa-globais` | `.cursor/skills/mapa-globais/` | Dúvida se a regra é global ou deste repo; Trello vs código vs UI |
| `registrar-escolhas` | `.cursor/skills/registrar-escolhas/` | Usuário escolheu stack, timer, convenção, “só neste projeto”, “isso é global” |
| `produto-pomodoro` | `.cursor/skills/produto-pomodoro/` | Timer, sessões, foco/pausa, persistência, stack, escopo do app |

Sem `disable-model-invocation` nestas skills, para o agente poder escolhê-las sozinho.

## O que NÃO vira skill neste repo

- Trello (board, cards, labels) → **não se aplica** neste app
- Husky, CI, DoD, env, one-shot → `AGENTS-codigo.md` global
- Olho na senha / confirmar senha / modal ao deletar → `ui-padroes` (salvo se o usuário disser que é **só** do Pomodoro)
- Skill genérica de React/Vite/Node — o modelo já sabe; aqui só entra o que for **deste** produto
- Copiar o `AGENTS.md` inteiro para dentro de uma skill
- Skills do BotWhatsBG / Ludarium / Sunsama clone

Quando a stack existir, criar skill de fluxo (ex. domínio do timer, overlay) — não uma skill “React” ou “Tauri”.

Atualize a tabela acima ao criar ou renomear skills.
