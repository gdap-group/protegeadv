# Relatório de Conferência do Projeto — Protege ADV & Protege Empresa

Data da auditoria: 05/11/2026  
Modo: Somente Leitura (nenhum arquivo foi alterado além deste relatório; nenhum commit foi realizado)

---

## 1. Git e Versionamento
- **Status da pasta:** A pasta é um repositório Git local inicializado (diretório `.git` presente).
- **Branch atual:** `master` (referência preliminar, sem commits).
- **Commits:** **Nenhum commit realizado.** A saída de `git log --oneline -n 20` resultou no erro exato:  
  `fatal: your current branch 'master' does not have any commits yet`
- **Remoto no GitHub:** **Nenhum remoto configurado.** A execução de `git remote -v` retornou vazia.

---

## 2. Tabelas do Banco de Dados

### 2.1 Tabelas Criadas nas Migrations (`supabase/migrations`)
Existem atualmente **30 tabelas** criadas nas 6 migrações SQL:
- **`0001_nucleo.sql` (8 tabelas):** `contas`, `usuarios`, `grupos`, `grupo_permissoes`, `usuario_grupos`, `etiquetas`, `processos`, `responsaveis_processo`.
- **`0002_empresas_etiquetas_campos.sql` (4 tabelas):** `empresas_monitoradas`, `etiqueta_vinculos`, `campos_personalizados`, `campos_personalizados_valores`.
- **`0003_partes_andamentos_buscas_leituras.sql` (4 tabelas):** `partes_processo`, `andamentos`, `pedidos_busca`, `leituras`.
- **`0004_publicacoes_distribuicoes_termos.sql` (5 tabelas):** `termos_vigiados`, `termo_vigiado_destinatarios`, `publicacoes`, `publicacao_termos`, `distribuicoes`.
- **`0005_ged_modelos_avisos.sql` (6 tabelas):** `ged_pastas`, `ged_arquivos`, `ged_versoes`, `modelos_documento`, `avisos`, `preferencias_aviso`.
- **`0006_auditoria_consultas_expurgo.sql` (3 tabelas):** `consultas_externas`, `registro_atividade`, `registro_acesso`.

### 2.2 Comparação com a Lista Esperada
Abaixo está o comparativo com a lista solicitada:

| Tabela Esperada | Existe? | Nome Real no Banco | Migration de Criação |
| :--- | :---: | :--- | :--- |
| `contas` | Sim | `contas` | `0001_nucleo.sql` |
| `usuarios` | Sim | `usuarios` | `0001_nucleo.sql` |
| `grupos` | Sim | `grupos` | `0001_nucleo.sql` |
| `grupo_permissoes` | Sim | `grupo_permissoes` | `0001_nucleo.sql` |
| `usuario_grupos` | Sim | `usuario_grupos` | `0001_nucleo.sql` |
| `pessoas` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `pessoa_contatos` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `pessoa_outros_nomes` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `empresas_monitoradas` | Sim | `empresas_monitoradas` | `0002_empresas_etiquetas_campos.sql` |
| `etiquetas` | Sim | `etiquetas` | `0001_nucleo.sql` |
| `etiqueta_vinculos` | Sim | `etiqueta_vinculos` | `0002_empresas_etiquetas_campos.sql` |
| `campos_personalizados` | Sim | `campos_personalizados` | `0002_empresas_etiquetas_campos.sql` |
| `campos_personalizados_valores` | Sim | `campos_personalizados_valores` | `0002_empresas_etiquetas_campos.sql` |
| `processos` | Sim | `processos` | `0001_nucleo.sql` |
| `partes_processo` | Sim | `partes_processo` | `0003_partes_andamentos_buscas_leituras.sql` |
| `responsaveis_processo` | Sim | `responsaveis_processo` | `0001_nucleo.sql` |
| `andamentos` | Sim | `andamentos` | `0003_partes_andamentos_buscas_leituras.sql` |
| `pedidos_busca` | Sim | `pedidos_busca` | `0003_partes_andamentos_buscas_leituras.sql` |
| `leituras` | Sim | `leituras` | `0003_partes_andamentos_buscas_leituras.sql` |
| `termos_vigiados` | Sim | `termos_vigiados` | `0004_publicacoes_distribuicoes_termos.sql` |
| `termo_vigiado_destinatarios` | Sim | `termo_vigiado_destinatarios` | `0004_publicacoes_distribuicoes_termos.sql` |
| `publicacoes` | Sim | `publicacoes` | `0004_publicacoes_distribuicoes_termos.sql` |
| `publicacao_termos` | Sim | `publicacao_termos` | `0004_publicacoes_distribuicoes_termos.sql` |
| `distribuicoes` | Sim | `distribuicoes` | `0004_publicacoes_distribuicoes_termos.sql` |
| `compromissos` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `compromisso_envolvidos` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `ged_pastas` | Sim | `ged_pastas` | `0005_ged_modelos_avisos.sql` |
| `ged_arquivos` | Sim | `ged_arquivos` | `0005_ged_modelos_avisos.sql` |
| `ged_versoes` | Sim | `ged_versoes` | `0005_ged_modelos_avisos.sql` |
| `modelos_documento` | Sim | `modelos_documento` | `0005_ged_modelos_avisos.sql` |
| `contratos` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `contrato_partes` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `contrato_processos` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `avisos` | Sim | `avisos` | `0005_ged_modelos_avisos.sql` |
| `preferencias_aviso` | Sim | `preferencias_aviso` | `0005_ged_modelos_avisos.sql` |
| `feriados` | **Não** | *(Não criada — prevista Fase 8)* | — |
| `consultas_externas` | Sim | `consultas_externas` | `0006_auditoria_consultas_expurgo.sql` |
| `registro_atividade` | Sim | `registro_atividade` | `0006_auditoria_consultas_expurgo.sql` |
| `registro_acesso` | Sim | `registro_acesso` | `0006_auditoria_consultas_expurgo.sql` |

### 2.3 Comparação com a Seção 18 do `docs/PRD.md`
A Seção 18 do PRD define 25 entidades conceituais de negócio:
- **Entidades implementadas nas migrations (19 entidades):**
  1. *Conta:* `contas`
  2. *Usuário:* `usuarios`
  3. *Grupo:* `grupos`, `grupo_permissoes`, `usuario_grupos`
  4. *Empresa monitorada:* `empresas_monitoradas`
  5. *Processo (pasta):* `processos`
  6. *Parte do processo:* `partes_processo`
  7. *Responsável do processo:* `responsaveis_processo`
  8. *Andamento:* `andamentos`
  9. *Publicação:* `publicacoes`
  10. *Termo vigiado:* `termos_vigiados`, `termo_vigiado_destinatarios`, `publicacao_termos`
  11. *Distribuição:* `distribuicoes`
  12. *Pedido de busca:* `pedidos_busca`
  13. *Leitura:* `leituras`
  14. *Pasta e arquivo do GED:* `ged_pastas`, `ged_arquivos`, `ged_versoes`
  15. *Modelo de documento:* `modelos_documento`
  16. *Etiqueta:* `etiquetas`, `etiqueta_vinculos`
  17. *Aviso:* `avisos`
  18. *Preferência de aviso:* `preferencias_aviso`
  19. *Consulta externa:* `consultas_externas`
  20. *Registro de atividade:* `registro_atividade`
  21. *Registro de acesso:* `registro_acesso`
  22. *Campo personalizado:* `campos_personalizados`, `campos_personalizados_valores`
- **Entidades NÃO implementadas (6 entidades do PRD):**
  1. *Pessoa* (PF/PJ, perfis, contatos, outros nomes — Seção 10 do PRD).
  2. *Compromisso* (Agenda, prazos, audiências — Seção 9 do PRD).
  3. *Contrato* (Honorários, vigência — Seção 12 do PRD).
  4. *Feriado* (Calendário judiciário/forense — Seção 9 do PRD).
  *(Nota: O documento `docs/BANCO.md` e `docs/PROGRESSO.md` registram que essas entidades foram mantidas fora das migrations atuais e reservadas para a Fase 8).*

---

## 3. RLS e Políticas de Segurança
- **RLS Ativada:** **SIM, em 100% das 30 tabelas** (`alter table <tabela> enable row level security;`).
- **Quantidade de Políticas:** **106 políticas no total**.
  - 20 tabelas com CRUD completo (4 políticas cada: `_ver`, `_criar`, `_editar`, `_excluir`).
  - 6 tabelas associativas/históricas com 3 políticas (`_ver`, `_criar`, `_excluir`): `usuario_grupos`, `responsaveis_processo`, `etiqueta_vinculos`, `termo_vigiado_destinatarios`, `publicacao_termos`, `ged_versoes`.
  - 4 tabelas append-only ou de controle com 2 políticas (`_ver`, `_criar` ou `_editar`): `contas`, `consultas_externas`, `registro_atividade`, `registro_acesso`.
- **Exigência de `conta_id = conta_atual()`:** **SIM**. 100% das 106 políticas impõem o filtro obrigatório por conta:
  - Na tabela `contas`: valida `id = conta_atual()`.
  - Nas 29 demais tabelas: validam `conta_id = conta_atual()`, combinadas com `pode()` e/ou `pode_ver_processo(processo_id)` quando aplicável.
- **Funções de Segurança:**
  - `conta_atual()`: **Existe** (`0001_nucleo.sql`, linha 181, `security definer`, `search_path = public`).
  - `perfil_atual()`: **Existe** (`0001_nucleo.sql`, linha 186, `security definer`, `search_path = public`).
  - `pode(p_modulo, p_acao)`: **Existe** (`0001_nucleo.sql`, linha 192, `security definer`, `search_path = public`).
  - `pode_ver_processo(p_processo_id)`: **Existe** (`0001_nucleo.sql`, linha 226, `security definer`, `search_path = public`).
- **Bloqueio de Estagiário e Somente Leitura em Contratos:**
  - **A tabela `contratos` não foi criada nas migrations atuais.** Portanto, **não existem políticas de RLS para contratos**.
  - O enum `modulo_sistema` possui o valor `'contratos'`.
  - Na função `pode()`, o perfil `leitura` está travado para não realizar `criar`, `editar` ou `excluir`, mas para visualização depende do grupo.
  - Para `estagiario`, a função `pode()` delega integralmente à tabela `grupo_permissoes`. Não há trava explícita em código bloqueando o estagiário em contratos; a restrição exigida no PRD (seção 3, linha 70) terá que ser configurada via RBAC ou inserida na futura migration de contratos.

---

## 4. Testes e Ambiente
- **Ambiente de execução dos testes de banco (`supabase/tests`):**
  - O arquivo [`supabase/tests/teste_isolamento.sql`](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/tests/teste_isolamento.sql) e os scripts de validação foram executados exclusivamente via **PGlite** (engine PostgreSQL compilada em WebAssembly/Node.js, conforme `scripts/test_seed.mjs` e `docs/PROGRESSO.md`).
  - **Não foram executados em um Supabase local real via Docker.**
- **Simulação de `auth.uid()` nos testes:**
  - O teste define uma função temporária `pg_temp.entrar_como(p_id uuid)` que injeta as variáveis de sessão:
    ```sql
    perform set_config('request.jwt.claim.sub', p_id::text, false);
    perform set_config('request.jwt.claims', json_build_object('sub', p_id::text, 'role', 'authenticated')::text, false);
    ```
    acompanhado de `set role authenticated;`. Dessa forma, as funções `auth.uid()` e `auth.role()` do Supabase extraem os claims simulados da sessão.
- **Disponibilidade de ferramentas nesta máquina:**
  - **Docker:** **NÃO DISPONÍVEL.** Erro exato retornado ao executar `docker --version`:  
    `docker : O termo 'docker' não é reconhecido como nome de cmdlet, função, arquivo de script ou programa operável.`
  - **Supabase CLI:** **DISPONÍVEL.** Retornou versão `2.58.5`.
- **Varredura automática de tabelas no teste de isolamento:**
  - **NÃO.** O arquivo `teste_isolamento.sql` não percorre as tabelas automaticamente. Ele contém 9 casos de teste manuais e direcionados apenas para `contas`, `usuarios`, `processos` e `responsaveis_processo`.

---

## 5. Supabase Remoto
- **Status das migrations e seed no projeto Dev remoto (`dvqrlgoqfsxrcjkfytfj`):**
  - **Não verificável diretamente via terminal:** O ambiente sandbox não possui permissão de saída de rede para chamadas REST ao endpoint remoto, e o servidor MCP do Supabase está autenticado com acesso a outro projeto (`qlrxponkhpvfvepnxmzo`), retornando erro:  
    `Access to project 'qlrxponkhpvfvepnxmzo' was denied. If this project exists, your access token may be scoped to a different organization`
  - **Pelo histórico documental (`docs/PROGRESSO.md`):**
    - A migration `0001_nucleo.sql` foi aplicada anteriormente com sucesso.
    - As migrations `0002_empresas_etiquetas_campos.sql` até `0006_auditoria_consultas_expurgo.sql` e o arquivo `supabase/seed.sql` constam explicitamente como **pendentes** de aplicação no painel remoto.
- **Como verificar manualmente no painel Supabase:**
  1. Acesse o console do projeto em: `https://supabase.com/dashboard/project/dvqrlgoqfsxrcjkfytfj`
  2. Clique em **Table Editor**:
     - Se houver apenas 8 tabelas (`contas`, `usuarios`, `grupos`, `grupo_permissoes`, `usuario_grupos`, `etiquetas`, `processos`, `responsaveis_processo`), as migrations 0002 a 0006 ainda não foram aplicadas.
     - Se constarem 30 tabelas, todas as migrations foram aplicadas.
  3. Abra a tabela `contas`:
     - Se estiver com 0 linhas, o `seed.sql` ainda não foi aplicado.
     - Se contiver as contas `Silva & Associados Advocacia` e `TechCorp Brasil Logística S.A.`, o seed já foi executado.
  4. Clique em **Database -> Migrations** para conferir o log de execuções.

---

## 6. Auditoria de Segredos e Credenciais
- **`apps/web`:** **LIMPO.** Nenhuma ocorrência de `service_role`, credenciais master ou senhas no código-fonte ou bundles. O arquivo `apps/web/.env` contém unicamente a `VITE_SUPABASE_ANON_KEY` (chave pública padrão para clientes web) e a URL do projeto.
- **Histórico Git:** **LIMPO.** Não existem commits no repositório, garantindo que nenhum segredo foi commitado.
- **Arquivos versionados:** No arquivo `.env` da raiz e no `apps/worker/.env`, o campo `SUPABASE_SERVICE_ROLE_KEY=` está vazio.
- **Proteção `.gitignore`:** **CONFIRMADO.** O arquivo `.gitignore` inclui as regras `.env` e `.env*.local`. Nenhum arquivo `.env` está sendo rastreado pelo Git.

---

## 7. Qualidade de Código (Saídas Resumidas)

### 7.1 `pnpm lint`
```text
> protege@ lint C:\Users\eu\Documents\P4D\Projetos\Protege ADV
> eslint .
(Executado sem erros — código de saída 0)
```

### 7.2 `pnpm typecheck`
```text
> protege@ typecheck C:\Users\eu\Documents\P4D\Projetos\Protege ADV
> tsc -b
(Executado sem erros de compilação ou de tipos — código de saída 0)
```

### 7.3 `pnpm test`
```text
> protege@ test C:\Users\eu\Documents\P4D\Projetos\Protege ADV
> vitest run

 ✓ packages/sources/src/index.test.ts (1 test) 3ms
 ✓ apps/worker/src/worker.test.ts (2 tests) 7ms
 ✓ apps/web/src/lib/utils.test.ts (2 tests) 8ms
 ✓ packages/shared/src/index.test.ts (3 tests) 4ms
 ✓ apps/web/src/App.test.tsx (1 test) 27ms

 Test Files  5 passed (5)
      Tests  9 passed (9)
   Duration  4.40s
(100% dos testes unitários aprovados — código de saída 0)
```

---

## 8. Checklist de Aceite

### Fase 0 — Fundação do Projeto
| Item | Status | Evidência |
| :--- | :---: | :--- |
| Estrutura Monorepo com `pnpm workspaces` | **OK** | `pnpm-workspace.yaml` configurado (`apps/*`, `packages/*`). |
| Configuração rigorosa de TypeScript | **OK** | `tsconfig.base.json` com `strict: true`, `noImplicitAny: true`. `pnpm typecheck` aprovado com 0 erros. |
| Padronização com ESLint e Prettier | **OK** | `eslint.config.js`, `.prettierrc` configurados. `pnpm lint` aprovado com 0 erros. |
| Framework de testes Vitest nos workspaces | **OK** | `vitest.workspace.ts` configurado. 5 arquivos e 9 testes unitários passando. |
| Pipeline de CI no GitHub Actions | **OK** | `.github/workflows/ci.yml` configurado com validação sequencial de `lint`, `typecheck` e `test`. |
| Repositório Git com commits e remoto | **FALHA** | Não há nenhum commit realizado (`No commits yet`) e nenhum remoto configurado (`git remote -v` vazio). |

### Fase 1 — Núcleo de Banco de Dados, Ambientes e RLS
| Item | Status | Evidência |
| :--- | :---: | :--- |
| Configuração do Supabase CLI e Ambientes | **OK** | `supabase/config.toml` configurado, `docs/AMBIENTES.md` e `.env.example` preenchidos. |
| Migration do Núcleo (`0001_nucleo.sql`) | **OK** | 8 tabelas criadas com `conta_id`, índices e triggers de auditoria. |
| Funções de Segurança RLS com `security definer` | **OK** | `conta_atual()`, `perfil_atual()`, `pode()`, `pode_ver_processo()` criadas com `search_path = public`. |
| RLS ativa em 100% das tabelas do núcleo | **OK** | RLS ligada e 28 políticas de isolamento implementadas em 0001. |
| Teste automatizado de isolamento RLS | **OK** | `supabase/tests/teste_isolamento.sql` com 9 casos de teste aprovados via PGlite. |
| Ambiente Docker local disponível | **FALHA** | `docker` não está instalado/disponível no PATH do sistema. |
| Aplicação da Migration 0001 no Supabase remoto | **NÃO VERIFICÁVEL** | Terminal sandbox sem acesso à internet externa e MCP Supabase apontando para outro projeto; registrado como OK em `docs/PROGRESSO.md`. |

### Fase 2 — Modelo de Dados Completo, Seed e Tipagem
| Item | Status | Evidência |
| :--- | :---: | :--- |
| **2.1: Migrations do Modelo Completo (0002 a 0006)** | **OK** | Criadas 22 novas tabelas (totalizando 30), todas com RLS ativada e políticas vinculadas a `conta_atual()`. |
| **2.1: Tabelas de Pessoas, Agenda e Contratos** | **FALHA / PENDENTE** | Não criadas nas migrations atuais (postergadas intencionalmente para a Fase 8 em `docs/BANCO.md`). |
| **2.1: Aplicação de 0002 a 0006 no Supabase remoto** | **FALHA / PENDENTE** | Consta como pendente de execução manual no SQL Editor do painel Supabase. |
| **2.2: Seed Multi-tenant com 2 Contas Completas** | **OK** | `supabase/seed.sql` criado contendo 2 contas, 6 usuários, 40 processos com CNJs matematicamente válidos e dados para todas as 30 tabelas. |
| **2.2: Aplicação do Seed no Supabase remoto** | **FALHA / PENDENTE** | Não aplicado no banco remoto dev ainda. |
| **2.3: Geração de Tipos TypeScript (`database.types.ts`)** | **OK** | `scripts/db_types.mjs` gerou tipos para as 30 tabelas em `packages/shared/src/database.types.ts`. `pnpm typecheck` 100% aprovado. |

---

## 9. Lista Numerada do que está Faltando ou Errado (Sem Correções)

1. **Repositório Git sem commits e sem remoto:** O Git está inicializado localmente, mas não existe nenhum commit inicial e nenhum remote configurado apontando para o GitHub.
2. **Docker não instalado:** O Docker Desktop ou daemon Docker não está disponível no sistema operacional, impedindo o uso do `supabase start` para ambiente local idêntico à nuvem.
3. **MCP do Supabase descalibrado:** O `supabase-mcp-server` está configurado para o projeto `qlrxponkhpvfvepnxmzo` em vez do projeto atual `dvqrlgoqfsxrcjkfytfj`, gerando erro de autorização.
4. **Migrations 0002 a 0006 não aplicadas no Supabase remoto:** As migrações de empresas, etiquetas, campos personalizados, partes, andamentos, publicações DJEN, distribuições, GED, modelos, avisos e auditoria ainda não foram executadas no SQL Editor do Supabase remoto.
5. **Seed multi-tenant não aplicado no Supabase remoto:** O arquivo `supabase/seed.sql` ainda não foi executado no banco remoto; o banco remoto dev não possui os dados de teste das duas contas (`Silva & Associados` e `TechCorp`).
6. **Tabelas de Pessoas, Agenda e Contratos ausentes:** As tabelas `pessoas`, `pessoa_contatos`, `pessoa_outros_nomes`, `compromissos`, `compromisso_envolvidos`, `feriados`, `contratos`, `contrato_partes` e `contrato_processos` não existem em nenhuma migration (estão previstas no PRD Seção 18 e foram alocadas para a Fase 8).
7. **Regra de bloqueio de estagiário em Contratos não implementada no banco:** Como a tabela `contratos` ainda não existe, não há políticas de RLS e nem validação explícita na função `pode()` impedindo o perfil `estagiario` de visualizar contratos de honorários (requisito da Seção 3 do PRD).
8. **Teste de isolamento não percorre todas as 30 tabelas:** O arquivo `supabase/tests/teste_isolamento.sql` cobre apenas 4 tabelas (`contas`, `usuarios`, `processos`, `responsaveis_processo`), não havendo asserções automáticas de RLS para as demais 26 tabelas.

