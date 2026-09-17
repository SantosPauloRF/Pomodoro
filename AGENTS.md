# AGENTS.md — Pomodoro

Instruções permanentes deste repositório. Detalhes de fluxo ficam em [Skills.md](./Skills.md) e em `.cursor/skills/*/SKILL.md`. Plano de produto e ordem de fatias: [PLANEJAMENTO.md](./PLANEJAMENTO.md).

Este arquivo é a lei do **projeto**. Não copie aqui o texto das regras globais — só o que for decisão **deste** app.

## O que é este projeto

App pessoal de **Pomodoro**: programa Windows de timer (foco / pausa). Não é o clone do Sunsama (`sunsuma clone`) nem o ecossistema Ludarium/BotWhatsBG. Não puxar planner, backlog, calendário ou multi-luderia sem pedido explícito.

## Fontes globais (aplicar, não duplicar)

Este projeto **aplica** os globais abaixo. Ler o arquivo canônico; não reescrever Husky/CI ou padrões de senha/delete neste `AGENTS.md`.

| Fonte | Caminho | Vale quando |
|-------|---------|-------------|
| Código | `C:\Users\santo\.cursor\AGENTS-codigo.md` | DoD, testes, Husky, CI, env, reuso, `dev`+browser |
| UI | `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md` | Formulários, senha, confirmar senha, modal ao deletar |

**Neste app, não usamos Trello** (exceção ao `AGENTS.md` global). Não criar board, cards, prefixo, nem seguir fluxo de branch-de-card. Não ler o Trello global para trabalho deste repo.

Não há subagentes globais em `~\.cursor\agents\` (pasta vazia). Skills globais deste usuário, para **este** repo: só `ui-padroes`. Skills `botwhatsbg-*` em `~\.cursor\skills\` são de outro produto — ignorar.

## Onde gravar uma escolha nova

Quando o usuário decidir algo, persistir **na mesma sessão** (skill `registrar-escolhas` / subagente `registrar-escolhas`):

| Tipo de escolha | Onde gravar |
|-----------------|-------------|
| Lei permanente deste app (stack, “não faça X”, arquitetura) | Este `AGENTS.md` + linha no [Changelog](#changelog) |
| Como fazer um fluxo (timer, persistência, tela) | Skill em `.cursor/skills/<nome>/` + linha em `Skills.md` |
| Plano / ordem de fatias / MVP | [PLANEJAMENTO.md](./PLANEJAMENTO.md) e, se for “não reabrir”, também este arquivo |
| Trello | **Não se aplica** neste repo |
| Organização de código / testes / CI / env | **Só** `AGENTS-codigo.md` global + changelog de lá |
| UI que o usuário disser que é **global** | Skill `ui-padroes` + changelog de lá |
| UI / copy / timer **só deste app** | `AGENTS.md` (curto) e/ou skill `produto-pomodoro` |

Se a escolha for global, **não** copiar o parágrafo para este repo — no máximo uma linha de ponteiro.

## Decisões deste repo (não reabrir sem pedido)

1. Produto = timer Pomodoro dedicado; escopo extra só com pedido.
2. Vale `AGENTS-codigo.md` e, em UI, `ui-padroes`.
3. **Neste app, não usamos Trello.**
4. Stack: **Tauri 2 + Vite + React + TypeScript**. App Windows nativo (janela + `.exe`). Sem banco, auth, Docker, fila ou hospedagem “de passagem”.
5. Persistência: **nenhuma** no MVP. Sem login.
6. UI e mensagens ao usuário em **português**.
7. Ao zerar o timer: backdrop fullscreen em **todos os monitores** + som de alerta; o próximo modo não inicia sozinho.
8. Commit só se o usuário pedir. Sem checklist Trello. Pedidos avulsos: sem testes no chat, salvo pedido ou ao criar/alterar testes da fatia.
9. Plano vigente: [PLANEJAMENTO.md](./PLANEJAMENTO.md).

Durações 25/5, som em loop vs um toque, e identidade visual: **TBD** (ver skill `produto-pomodoro`).

## Subagentes deste repo

| Agente | Arquivo | Papel |
|--------|---------|--------|
| `registrar-escolhas` | `.cursor/agents/registrar-escolhas.md` | Persistir decisão no arquivo certo |
| `pomodoro-dev` | `.cursor/agents/pomodoro-dev.md` | Implementar seguindo este AGENTS.md + skills |

## O que o agente deve ler primeiro

1. Este arquivo
2. [PLANEJAMENTO.md](./PLANEJAMENTO.md)
3. `C:\Users\santo\.cursor\AGENTS-codigo.md`
4. Em UI: `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md`
5. [Skills.md](./Skills.md) — qual skill abrir
6. Skill `produto-pomodoro` se a tarefa for de produto/timer/stack

## Changelog

| Data | Mudança |
|------|---------|
| 2026-09-17 | Criação: app Pomodoro; globais por ponteiro; escolhas TBD (stack, timer, persistência, Trello). |
| 2026-09-17 | Plano gravado: Windows/Tauri 2+Vite+React+TS; sem Trello; MVP timer + overlay em todos os monitores + som; sem persistência. |
