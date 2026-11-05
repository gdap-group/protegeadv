# Registro de Decisões Arquiteturais (ADR) — Protege ADV & Protege Empresa

Este documento registra as decisões técnicas, arquiteturais e de design tomadas no projeto, bem como seus motivos e impactos.

---

## Resumo das Escolhas Principais
- **Monorepo com pnpm:** Instalação ultra-rápida, deduplicação de dependências via hard links e gestão segura de pacotes locais via `workspace:*`.
- **Vitest:** Execução de testes em ESM nativo com suporte direto a TypeScript e ambientes isolados (`jsdom` e `node`) em workspaces.
- **CI (GitHub Actions):** Automação em todo push e pull request com cache de dependências que bloqueia qualquer falha de lint, typecheck ou teste.

---

## ADR 001: Arquitetura em Monorepo com pnpm Workspaces
- **Status:** Aceito
- **Contexto:** O ecossistema do Protege ADV envolve uma aplicação web (React + Vite + Tailwind + shadcn/ui), um worker de coleta em segundo plano (Node.js + TypeScript) e pacotes compartilhados (`shared` e `sources`).
- **Decisão:** Adotar Monorepo com `pnpm workspaces` (`pnpm-workspace.yaml`), com `tsconfig.base.json` em modo estrito, ESLint, Prettier e Vitest orquestrados na raiz e nos pacotes.
- **Motivo:** Instalação ultra-rápida, deduplicação de dependências via hard links e gestão segura de pacotes locais via `workspace:*`.

---

## ADR 002: Separação de Pacotes (`packages/shared` e `packages/sources`)
- **Status:** Aceito
- **Contexto:** O sistema conversa com diferentes bases externas (DataJud, DJEN e Judit/Data Lake CNJ) e precisa garantir que formatos brutos nunca cheguem às telas (RF-INT-01).
- **Decisão:**
  - `packages/shared`: Modelos de domínio, entidades com `conta_id`, validações Zod e validador de número CNJ (mod 97).
  - `packages/sources`: Adaptadores das fontes de dados (mantido vazio por enquanto nesta etapa de fundação).
- **Motivo:** Alta testabilidade, isolamento de contratos e substituição de fornecedores sem impacto nas telas.

---

## ADR 003: Isolamento Multi-tenant via `conta_id` e RLS
- **Status:** Aceito
- **Contexto:** Advogados e empresas dividem a mesma infraestrutura, mas nenhuma conta pode visualizar dados de outra sob qualquer hipótese (RNF-SEG-02).
- **Decisão:** Todas as tabelas que guardam dados de clientes possuem a coluna `conta_id` e RLS ativado no Supabase/PostgreSQL.
- **Motivo:** Segurança em nível de banco de dados, auditável e imutável mesmo se houver falha de camada na aplicação.

---

## ADR 004: TypeScript Estrito e Validação com Zod
- **Status:** Aceito
- **Contexto:** Dados judiciais e inputs manuais precisam ser rigorosamente higienizados.
- **Decisão:** `tsconfig.base.json` configurado com `strict: true` e flags adicionais (`noImplicitAny`, `noUncheckedIndexedAccess`, etc.). Entradas validadas com Zod, sem uso de `any`.
- **Motivo:** Prevenção de bugs em tempo de execução e conformidade com a Regra 7 do projeto.

---

## ADR 005: Framework de Testes Unificado com Vitest
- **Status:** Aceito
- **Contexto:** Garantir cobertura automatizada e execução ultra-rápida em ambiente monorepo.
- **Decisão:** Utilização do Vitest via `vitest.workspace.ts`, integrando jsdom para testes de UI e node para worker e bibliotecas.
- **Motivo:** Execução de testes em ESM nativo com suporte direto a TypeScript e ambientes isolados (`jsdom` e `node`) em workspaces.

---

## ADR 006: Pipeline de Integração Contínua (CI) com GitHub Actions
- **Status:** Aceito
- **Contexto:** Garantir a integridade da base de código antes de qualquer mesclagem, prevenindo regressões de tipos, formatação e testes quebrados.
- **Decisão:** Workflow `.github/workflows/ci.yml` rodando em todo `push` e `pull_request`, executando `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck` e `pnpm test` com cache de dependências.
- **Motivo:** Automação em todo push e pull request com cache de dependências que bloqueia qualquer falha de lint, typecheck ou teste.

---

## ADR 007: Gestão de Feriados e Suspensões de Prazos por Conta (`conta_id`)
- **Status:** Aceito
- **Contexto:** Conforme a Seção 9.4 (RF-AGE-11) do PRD, cada escritório atua em foros e tribunais específicos e precisa gerenciar não apenas feriados nacionais, mas também feriados estaduais, municipais e portarias de suspensão de prazos forenses emitidas por tribunais específicos.
- **Decisão:** A tabela `feriados` foi criada como entidade multi-tenant vinculada obrigatoriamente a `conta_id`, pré-carregada por conta com feriados nacionais e customizável com feriados regionais.
- **Motivo:** Evita colisão entre contas com jurisdições distintas, respeita a integridade do isolamento via RLS e atende ao requisito de cálculo customizado de contagem de prazos sem poluição de dados globais.

---

## ADR 008: Bloqueio Rigoroso de Estagiário e Leitura em Contratos via RLS
- **Status:** Aceito
- **Contexto:** O PRD Seção 3 (linha 70) determina explicitamente que estagiários não podem ver contratos de honorários e valores financeiros, e usuários de perfil leitura não possuem permissão de escrita.
- **Decisão:** As políticas de RLS das tabelas `contratos`, `contrato_partes` e `contrato_processos` exigem explicitamente `perfil_atual() in ('dono', 'advogado')`, além da checagem modular `pode('contratos', acao)`.
- **Motivo:** Defesa em profundidade. Mesmo que uma conta crie inadvertidamente um grupo de permissões com `pode_ver = true` e adicione um estagiário, a camada de banco de dados (RLS) rejeita a consulta ou mutação de dados contratuais.

---

## ADR 009: Herança de Visibilidade de Processos em Compromissos da Agenda
- **Status:** Aceito
- **Contexto:** Usuários com restrição de visibilidade (`restringir_a_responsavel = true`) só podem visualizar processos em que atuem como responsáveis ou envolvidos (PRD 3.3). Compromissos de prazos ou audiências vinculados a esses processos não podem vazar informações a terceiros.
- **Decisão:** A tabela `compromissos` e a tabela associativa `compromisso_envolvidos` impõem a validação `(processo_id is null or pode_ver_processo(processo_id))` nas políticas de RLS.
- **Motivo:** Garante que a agenda e o kanban do escritório mantenham o mesmo sigilo rigoroso das pastas processuais sem qualquer vazamento de dados via registros filhos.

