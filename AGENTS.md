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
5. Persistência: **durações do ciclo** no `localStorage` da janela. Sem login, sem banco.
6. UI e mensagens ao usuário em **português**.
7. Ao zerar o timer: backdrop fullscreen em **todos os monitores**, **50% transparente**, com **animação ao abrir** + som de alerta; o próximo modo não inicia sozinho.
8. Ciclo: **4 focos** — pausa curta depois dos focos 1–3; pausa longa depois do 4º. Durações editáveis na tela de configuração (iniciais 25 / 5 / 15 min).
9. Ao **minimizar** ou **clicar fora** da janela: ícone flutuante always-on-top, **arrastável**, tomate com relógio **sem fundo de janela**; **anel de progresso** em volta de todo o widget; interior do círculo com backdrop **50% transparente** (igual ao overlay ao zerar); no centro **horário atual**, **dia da semana** e **dia do mês**; **play** embaixo por cima do círculo (vira **pause** se o timer estiver rodando); clique no ícone abre de novo a janela.
10. Commit só se o usuário pedir. Sem checklist Trello. Pedidos avulsos: sem testes no chat, salvo pedido ou ao criar/alterar testes da fatia.
11. Plano vigente: [PLANEJAMENTO.md](./PLANEJAMENTO.md).
12. **Entendi** leva à tela do próximo modo (pausa ou foco) **parado**, para o usuário iniciar.
13. **Pular** avança o modo atual (foco ou pausa) sem esperar o tempo; não abre overlay.
14. Ícone do app (janela, `.exe`, barra de tarefas) e do flutuante: **tomate com relógio**.
15. Visual da janela: fundo escuro, anel de progresso, acento coral, cartões e botão-pílula — no modelo da referência escolhida. Copy em português.

Som em loop vs um toque: **TBD** (ver skill `produto-pomodoro`).

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
| 2026-09-17 | Clicar fora da janela principal também minimiza para o ícone flutuante. |
| 2026-09-17 | Backdrop 50% transparente com animação; ícone flutuante sem fundo de janela; Entendi abre o próximo modo parado; dá para pular foco e pausa. |
| 2026-09-17 | Ícone do app e do flutuante: tomate com relógio. |
| 2026-09-17 | Ícone flutuante mostra horário atual, dia da semana e dia do mês. |
| 2026-09-17 | Visual da janela no modelo da referência: fundo escuro, anel, acento coral. |
| 2026-09-17 | Ícone flutuante com anel de progresso em volta de todo o widget e backdrop 50% no círculo. |
| 2026-09-17 | Play/pause no flutuante, embaixo por cima do círculo. |
