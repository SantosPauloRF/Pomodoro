# AGENTS.md — Pomodoro

Instruções permanentes deste repositório. Detalhes de fluxo ficam em [Skills.md](./Skills.md) e em `.cursor/skills/*/SKILL.md`.

Este arquivo é a lei do **projeto**. Não copie aqui o texto das regras globais — só o que for decisão **deste** app.

## O que é este projeto

App pessoal de **Pomodoro** (timer de foco / pausa). Repo novo; stack, persistência e board Trello **ainda não escolhidos**.

Não é o clone do Sunsama (`sunsuma clone`) nem o ecossistema Ludarium/BotWhatsBG. Não puxar planner, backlog, calendário ou multi-luderia sem pedido explícito.

## Fontes globais (aplicar, não duplicar)

Este projeto **aplica** os globais abaixo. Ler o arquivo canônico; não reescrever colunas Trello, Husky/CI ou padrões de senha/delete neste `AGENTS.md`.

| Fonte | Caminho | Vale quando |
|-------|---------|-------------|
| Trello | `C:\Users\santo\.cursor\AGENTS.md` | Cards, colunas, labels, checklists, branch, **nunca mover cards** |
| Código | `C:\Users\santo\.cursor\AGENTS-codigo.md` | DoD, testes, Husky, CI, env, reuso, `dev`+browser |
| UI | `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md` | Formulários, senha, confirmar senha, modal ao deletar |

Não há subagentes globais em `~\.cursor\agents\` (pasta vazia). Skills globais deste usuário, para **este** repo: só `ui-padroes`. Skills `botwhatsbg-*` em `~\.cursor\skills\` são de outro produto — ignorar.

Convenção Trello **deste** board (prefixo, URL, ID `POM-…`): ainda não definida. Não criar board nem cards sem o usuário pedir.

## Onde gravar uma escolha nova

Quando o usuário decidir algo, persistir **na mesma sessão** (skill `registrar-escolhas` / subagente `registrar-escolhas`):

| Tipo de escolha | Onde gravar |
|-----------------|-------------|
| Lei permanente deste app (stack, “não faça X”, arquitetura) | Este `AGENTS.md` + linha no [Changelog](#changelog) |
| Como fazer um fluxo (timer, persistência, tela) | Skill em `.cursor/skills/<nome>/` + linha em `Skills.md` |
| Trello (colunas, labels, checklists, never-move) | **Só** o `AGENTS.md` global + changelog de lá |
| Organização de código / testes / CI / env | **Só** `AGENTS-codigo.md` global + changelog de lá |
| UI que o usuário disser que é **global** | Skill `ui-padroes` + changelog de lá |
| UI / copy / timer **só deste app** | `AGENTS.md` (curto) e/ou skill `produto-pomodoro` |

Se a escolha for global, **não** copiar o parágrafo para este repo — no máximo uma linha de ponteiro.

## Decisões deste repo (não reabrir sem pedido)

1. Produto = timer Pomodoro dedicado; escopo extra só com pedido.
2. Vale `AGENTS-codigo.md` e, em UI, `ui-padroes`.
3. Vale o Trello global quando houver board; agente **não move** cards.
4. Stack, durações do timer, persistência, deploy e prefixo Trello: **TBD** — não introduzir framework, banco, fila, Docker ou hospedagem “de passagem”.
5. UI e mensagens ao usuário em **português** (padrão `AGENTS-codigo`).
6. Commit só no fechamento do checklist **Desenvolvimento cursor** ou se o usuário pedir. Pedidos avulsos: sem commit e sem testes, salvo pedido.

Quando uma destas deixar de ser TBD, atualizar este bloco e a skill `produto-pomodoro`.

## Subagentes deste repo

| Agente | Arquivo | Papel |
|--------|---------|--------|
| `registrar-escolhas` | `.cursor/agents/registrar-escolhas.md` | Persistir decisão no arquivo certo |
| `pomodoro-dev` | `.cursor/agents/pomodoro-dev.md` | Implementar seguindo este AGENTS.md + skills |

## O que o agente deve ler primeiro

1. Este arquivo
2. `C:\Users\santo\.cursor\AGENTS-codigo.md`
3. Em Trello: `C:\Users\santo\.cursor\AGENTS.md`
4. Em UI: `C:\Users\santo\.cursor\skills\ui-padroes\SKILL.md`
5. [Skills.md](./Skills.md) — qual skill abrir
6. Skill `produto-pomodoro` se a tarefa for de produto/timer/stack

## Changelog

| Data | Mudança |
|------|---------|
| 2026-09-17 | Criação: app Pomodoro; globais por ponteiro; escolhas TBD (stack, timer, persistência, Trello). |
