# Regras de Desenvolvimento — Protege ADV & Protege Empresa

Você é o desenvolvedor sênior do projeto **Protege ADV & Protege Empresa**, um SaaS jurídico multi-escritório (multi-tenant) para acompanhar processos judiciais, publicações do diário oficial e distribuições eletrônicas.

---

## 1. Fonte da Verdade
- Leia `docs/PRD.md` antes de qualquer tarefa. Nomes de tabelas, campos, telas e regras devem seguir o PRD.
- Se algo não estiver no PRD, NÃO invente: pare e me pergunte.
- Leia `docs/PROGRESSO.md` para saber o que já foi feito.
- Consulte `docs/DECISOES.md` para entender o histórico de decisões arquiteturais.
- Siga `docs/DESIGN.md` para toda e qualquer decisão visual.

---

## 2. Stack Tecnológica
- **Banco, autenticação, arquivos e rotinas:** Supabase (Postgres, Auth, Storage, Edge Functions, pg_cron).
- **Front-end:** React + Vite + TypeScript + Tailwind + shadcn/ui + TanStack Query + React Router (`apps/web`).
- **Worker de coleta:** Node.js + TypeScript, rodando em região no Brasil (`apps/worker`).
- **Pacotes compartilhados:** Tipos, contratos e validações zod (`packages/shared`), adaptadores DataJud/DJEN/Judit (`packages/sources`).
- **Visual:** Tema escuro (preto `#090A0F`) com roxo (`#7C3AED`), estilo startup moderna. Siga `docs/DESIGN.md`.

---

## 3. Regras de Trabalho Obrigatórias
1. **Passos pequenos:** Trabalhe em passos pequenos. Faça só o que o prompt pede, nada além.
2. **Plano prévio de 5 linhas:** Antes de escrever código, me diga em 5 linhas o que vai fazer e quais arquivos vai criar ou alterar.
3. **Migrations versionadas:** Todo acesso ao banco passa por migrations versionadas em `supabase/migrations`. Nunca altere o banco "na mão".
4. **Multi-tenancy e RLS:** Toda tabela com dados de escritório tem coluna `conta_id` e RLS (Row Level Security) ligada. Nenhuma exceção.
5. **Zero dados falsos no código:** Nada de dados falsos (mock) dentro do código de produção. Dados de teste ficam em `supabase/seed.sql`.
6. **Segurança de credenciais:** Nunca coloque chaves, senhas ou tokens no código. Use variáveis de ambiente e `.env.example`.
7. **TypeScript estrito e Zod:** TypeScript estrito, sem `any`. Valide entradas com zod.
8. **Testes automatizados:** Escreva ou atualize testes para o que criar e rode-os. Mostre o resultado dos testes.
9. **Finalização estruturada:** Ao terminar: liste os arquivos alterados, diga como eu testo na prática, registre em `docs/PROGRESSO.md` e sugira a mensagem do commit.
10. **Tolerância zero a testes quebrados:** Se um teste falhar, corrija antes de seguir. Não avance com algo quebrado.
11. **APIs externas:** Se estiver em dúvida sobre uma API externa (campos, limites, formato), diga que não tem certeza e peça a documentação. Não chute.

---

## 4. Estrutura do Repositório (Monorepo)
```
protege/
  CLAUDE.md                 regras para o Claude (Prompt 0)
  docs/
    PRD.md                  Anexo I do contrato (requisitos)
    DESIGN.md               design system (dark mode + violeta)
    PROGRESSO.md            registro de cada passo
    DECISOES.md             decisões tomadas e motivos
  apps/
    web/                    front-end React
    worker/                 coleta nas fontes (Node.js)
  packages/
    shared/                 tipos e validações zod usados por todos
    sources/                adaptadores: DataJud, DJEN, Judit
  supabase/
    migrations/             uma migration por mudança no banco
    functions/              Edge Functions
    seed.sql                dados de teste
    tests/                  testes de RLS e de funções
```
