# Progresso do Projeto — Protege ADV & Protege Empresa

Este documento registra o histórico de tarefas executadas, decisões tomadas e os próximos passos do projeto.

---

## [2026-11-05] Passo 3.2 Concluído: Componentes Base e Rota de Design Estendida (Fase 3)

### O que foi feito:
- [x] **Construção dos 17 Componentes Base em `apps/web/src/components/ui`:**
  - `Button`: Variantes `primary`, `secondary`, `ghost`, `danger`, tamanhos (`sm`, `default`, `lg`, `icon`), estados de loading com spinner, disabled e active scale.
  - `Input`: Raio 8px, foco visível em roxo, placeholder muted e estados normal, desabilitado e erro (`aria-invalid`).
  - `Textarea`: Raio 8px, expansível, estados normal e erro.
  - `Select`: Construído com Radix UI Select (`Trigger`, `Content`, `Item`, `Value`, `Separator`), navegação por teclado e estados normal, desabilitado e erro.
  - `Checkbox`: Construído com Radix UI Checkbox, estados marcado, desmarcado e desabilitado, alternável por clique ou barra de espaço.
  - `Switch`: Construído com Radix UI Switch, transição suave de 200ms para alternância de configurações.
  - `Badge`: Variantes semânticas (`success`, `warning`, `danger`, `neutro`, `info`) acompanhadas obrigatoriamente de ícone semântico e texto (critério de redundância visual, sem dependência exclusiva de cor).
  - `Card`: Estrutura com `Header`, `Title`, `Description`, `Content`, `Footer`, raio de 12px, suporte a brilho roxo (`glow-card`) e fundo `surface`.
  - `Tabs`: Construído com Radix UI Tabs para alternância de visões em pastas processuais (Publicações, Andamentos, Partes).
  - `Dialog`: Janela modal com overlay translúcido, foco travado, abertura via Enter/Espaço e fechamento estrito via tecla `Escape`.
  - `Sheet`: Painel lateral deslizante (gaveta/drawer) para leitura de teor de intimações e publicações judiciais com tecla `Escape`.
  - `DropdownMenu`: Menu de ações contextual com itens, divisores, rótulos e variante `danger`.
  - `Tooltip`: Dicas contextuais com delay e renderização acessível.
  - `Toast`: Sistema de notificações com contexto React (`useToast`), suporte a variantes semânticas com ícones e região `aria-live`.
  - `Skeleton`: Indicador visual de carregamento pulsante com raio de 8px.
  - `EmptyState`: Componente para estados vazios (caixa de publicações sem itens, lista sem processos) com ícone, título, descrição e botão de ação.
  - `DataTable`: Tabela de alta densidade (linhas com altura de 44px) construída com `@tanstack/react-table` v8, suportando ordenação ao clicar no cabeçalho, paginação completa e seleção de linhas com checkboxes acessíveis.
- [x] **Aplicação das Regras Estritas de Contraste e Acessibilidade:**
  - `Button` na variante `primary` adota `primary-hover` (`#7C3AED`) como fundo base, alcançando contraste de **5,7:1** com texto branco/claro (atendendo ao mínimo de 4,5:1).
  - Links e elementos interativos em cartões (`surface`) utilizam a cor `glow` (`#A78BFA`), eliminando o uso inadequado de cores escuras em fundos escuros.
  - Foco visível em roxo (`:focus-visible`) ativo em 100% dos controles.
- [x] **Extensão da Rota `/_design`:**
  - Página [`apps/web/src/pages/DesignPage.tsx`](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/apps/web/src/pages/DesignPage.tsx) expandida para exibir todos os 17 componentes em todos os seus estados: normal, hover, foco, desabilitado, carregando e erro.
  - Mantido o isolamento estrito com `import.meta.env.DEV` e `React.lazy`, confirmado ausente no bundle de produção.
- [x] **Testes Automatizados com `vitest-axe`:**
  - Criado [`apps/web/src/components/ui/components.test.tsx`](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/apps/web/src/components/ui/components.test.tsx) contendo 34 testes (renderização + acessibilidade axe para cada componente).
  - Validação de navegação por teclado: `Tab`, `Enter`, `Espaço` e fechamento com `Escape` em `Dialog`, `Sheet` e `DropdownMenu`.
- [x] **Governança de Cores:**
  - O teste [`apps/web/src/theme.test.ts`](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/apps/web/src/theme.test.ts) permanece com 100% de aprovação (zero cores literais hex/rgb fora de `theme.css`).


---

## [2026-11-05] Passo 3.1 Concluído: Tokens, Tema Canônico e Página de Teste de Cores (Fase 3)

### O que foi feito:
- [x] **Configuração de shadcn/ui e Tailwind v4:**
  - Criação do arquivo de governança [apps/web/components.json](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/apps/web/components.json) integrando Tailwind v4, `@/lib/utils` e Lucide Icons.
  - Mapeamento das variáveis semânticas de `:root` para o design system do shadcn/ui.
- [x] **Centralização dos Tokens de Cor em Arquivo Único:**
  - Criação do arquivo canônico [apps/web/src/theme.css](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/apps/web/src/theme.css) contendo rigorosamente as 13 cores oficiais:
    `bg` (`#0A0A0F`), `surface` (`#12121A`), `elevated` (`#1A1A26`), `border` (`rgba(255,255,255,0.08)`), `primary` (`#8B5CF6`), `primary-hover` (`#7C3AED`), `glow` (`#A78BFA`), gradiente de destaque (`#8B5CF6` para `#6366F1`), `text` (`#F4F4F8`), `muted` (`#9CA3AF`), `success` (`#34D399`), `warning` (`#FBBF24`), `danger` (`#F87171`).
- [x] **Tipografia Local com @fontsource:**
  - Instalação dos pacotes locais `@fontsource/inter` e `@fontsource/jetbrains-mono` em `apps/web` (sem dependência de fontes externas ou CDNs).
  - Aplicação de `Inter` para interface geral (corpo 14-15px, títulos peso 600) e `JetBrains Mono` para números de processo CNJ, códigos e identificadores.
- [x] **Forma, Movimento e Acessibilidade:**
  - Raio de 12px para cartões e 8px para campos de formulário.
  - Borda sutil de 1px e efeito de brilho roxo suave (`glow-card` / `--shadow-glow`).
  - Linhas de tabela com altura padronizada de 44px (`.table-row-standard`).
  - Foco visível em roxo (`:focus-visible`) em 100% dos elementos interativos com outline de 2px em `var(--color-primary)`.
  - Transições suaves de 150ms a 200ms.
- [x] **Rota de Teste de Design (`/_design`):**
  - Implementação em [apps/web/src/pages/DesignPage.tsx](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/apps/web/src/pages/DesignPage.tsx) exibindo as 13 cores com valores lidos dinamicamente de CSS, escala tipográfica, cartão com brilho, botão com gradiente, controles de formulário com foco e tabela com linhas de 44px.
  - Isolamento estrito para desenvolvimento: ativada apenas sob `import.meta.env.DEV` com `React.lazy()`.
  - Verificação de build de produção: confirmada a exclusão completa (tree-shaking) do bundle final.
- [x] **Teste Automatizado de Governança de Cores:**
  - Criação de [apps/web/src/theme.test.ts](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/apps/web/src/theme.test.ts).
  - Varre recursivamente `apps/web/src` e falha se qualquer hexadecimal ou função `rgb()`/`rgba()` for declarada fora de `theme.css`.
- [x] **Cálculo de Razão de Contraste WCAG:**
  - `text` sobre `bg`: **18.00:1** (APROVADO >= 4.5:1)
  - `muted` sobre `bg`: **7.78:1** (APROVADO >= 4.5:1)
  - `text` sobre `surface`: **16.98:1** (APROVADO >= 4.5:1)
  - `muted` sobre `surface`: **7.34:1** (APROVADO >= 4.5:1)
  - `branco` (`#FFFFFF`) sobre `primary` (`#8B5CF6`): **4.23:1** (ALERTA: abaixo de 4.5:1 para texto normal; atende ao critério de 3:1 para texto grande e componentes gráficos).


---

## [2026-11-05] Aplicação de Migrations 0001 a 0010 e Teste de Isolamento no Supabase Real (dev: dvqrlgoqfsxrcjkfytfj)

### O que foi feito:
- [x] **Alinhamento do Banco Remoto:**
  - Aplicação integral das migrations `0001_nucleo.sql` a `0010_visibilidade_contratos.sql` e do seed de desenvolvimento fictício (`supabase/seed.sql`) via `supabase db reset --linked`.
  - Histórico de migrações (`supabase_migrations.schema_migrations`) 100% alinhado com o repositório local.
- [x] **Conferência Prévia Somente de Leitura no Supabase Remoto:**
  - 39 tabelas do schema `public` verificadas: todas com Row Level Security (RLS) habilitada e contagem de políticas IDÊNTICA ao ambiente local PGlite.
  - Funções essenciais confirmadas no banco remoto: `conta_atual`, `perfil_atual`, `pode`, `pode_ver_processo` e `pode_ver_contrato`.
  - Privilégios dos papéis `anon` e `authenticated` verificados nas 39 tabelas (garantindo que o Postgres avalie o RLS sem bypass indevido).
- [x] **Implementação e Execução do Teste de Isolamento no Supabase Remoto:**
  - Criação do comando `pnpm test:db:remoto` (`scripts/run_test_db.mjs --remote`).
  - Verificação defensiva de segurança: lê `SUPABASE_DB_URL` do `.env` sem jamais expor a credencial em saídas ou logs, e aborta caso o project-ref não contenha `dvqrlgoqfsxrcjkfytfj`.
  - Validação estática antes da execução: exige exatamente 39 tabelas em `public` e 2 contas registradas.
  - Execução da suíte completa de isolamento (`supabase/tests/teste_isolamento_completo.sql`) dentro de transação com `ROLLBACK`.
  - **Resultado:** 39 tabelas varridas, 577 asserções executadas, **0 falhas** (100% de sucesso no PostgreSQL gerenciado na nuvem).
- [x] **Atualização Documental e Governança:**
  - [docs/AMBIENTES.md](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/docs/AMBIENTES.md): Registrada a região `us-east-1` (North Virginia) para o projeto dev atual com dados sintéticos, reiterando a obrigatoriedade estrita de `sa-east-1` (São Paulo) para produção conforme Seção 19 do PRD.
  - [docs/DECISOES.md](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/docs/DECISOES.md): Formalização da ADR 012 detalhando a estratégia de ambientes e a validação remota de segurança.


---

## [2026-11-05] Verificação Somente de Leitura do Supabase Remoto (CLI Linked)

### O que foi verificado:
- [x] **Project-ref confirmado:** O projeto vinculado via Supabase CLI é `dvqrlgoqfsxrcjkfytfj` (registrado em `supabase/.temp/project-ref`).
- [x] **Diagnóstico de `supabase migration list`:**
  - Todas as 10 migrations locais (`0001` a `0010`) aparecem sem registro correspondente na coluna `Remote`.
  - A migration `0001` não está registrada na tabela de histórico remoto (`supabase_migrations.schema_migrations`), embora sua estrutura já exista no banco remoto.
- [x] **Diagnóstico de `supabase db push --dry-run`:**
  - O CLI indica que tentaria aplicar em lote todas as migrações: `0001_nucleo.sql` até `0010_visibilidade_contratos.sql`.
  - **Risco detectado:** Rodar `supabase db push` diretamente falhará ao tentar recriar tabelas da 0001 (ex: `contas`).
  - **Solução recomendada para alinhamento:** Executar `supabase migration repair --status applied 0001` antes de enviar as migrações 0002 a 0010 (aguardando autorização explícita).

---

## [2026-11-05] Passo 2.3 Concluído: Visibilidade Granular de Contratos (Migration 0010) e Teste de Isolamento Universal Aprovado

### O que foi feito:
- [x] Criação de [0010_visibilidade_contratos.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/migrations/0010_visibilidade_contratos.sql):
  - Função `public.pode_ver_contrato(p_contrato_id uuid)` com `security definer` e `search_path = public`, evitando recursão mútua de RLS.
  - Regra de visibilidade para advogado restrito: vê contratos em que é parte (`contrato_partes`), criador (`criado_por`) ou vinculados a pelo menos um processo para o qual `pode_ver_processo()` é verdadeiro.
  - Adição de `criado_por uuid references usuarios(id) default auth.uid()` em `contratos` garantindo suporte imediato a `INSERT ... RETURNING *`.
  - Remoção de `contratos.valor` (campo não previsto no PRD Seções 12 e 18), com ajuste em [supabase/seed.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/seed.sql) e regeneração das tipagens via `pnpm db:types`.
  - Substituição das políticas de `contratos`, `contrato_partes` e `contrato_processos` para exigirem `pode_ver_contrato()`, com exigência adicional de `pode_ver_processo(processo_id)` em `contrato_processos`.
- [x] Atualização de [teste_isolamento_completo.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/tests/teste_isolamento_completo.sql) cobrindo todos os cenários granulares:
  - Advogado restrito bloqueado em contratos de processos restritos.
  - Advogado restrito enxerga contratos em que é parte (mesmo sem processos).
  - Advogado restrito enxerga contratos de processos permitidos.
  - Criador restrito enxerga o contrato criado logo em seguida com `INSERT ... RETURNING`.
  - Dono e advogado sem restrição enxergam todos os contratos.
  - Estagiário e leitura continuam bloqueados integralmente.
- [x] Validação do "teste do teste": remoção propositada de `pode_ver_contrato()` de uma política faz o teste falhar e acusar o nome da política.
- [x] Execução de todas as suítes com 100% de aprovação: `pnpm test:db` (0 falhas), `pnpm lint` (0 erros), `pnpm typecheck` (0 erros) e `pnpm test` (9 testes unitários aprovados).

---

## [2026-10-16] Automação de CI com GitHub Actions e Governança de Decisões

### O que foi feito:
- [x] Criação do workflow de CI do GitHub Actions em `.github/workflows/ci.yml`:
  - Disparado em todo `push` e `pull_request`.
  - Configurado com `pnpm/action-setup@v4` e cache nativo no `actions/setup-node@v4`.
  - Instalação rigorosa via `pnpm install --frozen-lockfile`.
  - Execução sequencial bloqueante de `pnpm lint`, `pnpm typecheck` e `pnpm test` (falha imediata em qualquer erro).
- [x] Atualização de `docs/DECISOES.md` consolidando as escolhas arquiteturais até aqui (Monorepo com pnpm, Vitest, CI) com uma linha de motivo para cada uma.
- [x] Validação local de todos os passos da esteira: lint limpo, typecheck estrito passando e 9 testes unitários aprovados.

---

## [2026-10-16] Configuração do Supabase CLI e Ambientes

### O que foi feito:
- [x] Inicialização do Supabase CLI com geração de `supabase/config.toml` (projeto `Protege_ADV`, PostgreSQL 17).
- [x] Criação de scripts de banco de dados no `package.json` da raiz (`db:start`, `db:stop`, `db:reset`, `db:migrate`, `db:types`).
- [x] Integração de tipagens do banco com `@supabase/supabase-js` em `apps/web/src/lib/supabase.ts` e exportação via `packages/shared`.
- [x] Criação de `docs/AMBIENTES.md` com instruções detalhadas para São Paulo (`sa-east-1`), `supabase link`, `supabase start` e variáveis de ambiente.
- [x] Atualização de `.env.example` com todas as variáveis para web e worker sem valores sensíveis.

---

## [2026-10-16] Fundação do Monorepo com pnpm Workspaces

### O que foi feito:
- [x] Estrutura monorepo com `pnpm-workspace.yaml` (`apps/web`, `apps/worker`, `packages/shared`, `packages/sources`, `supabase/`).
- [x] `tsconfig.base.json` estrito, ESLint flat config, Prettier e Vitest Workspaces.

## [2026-10-16] Implantação da Migration do Núcleo e Testes de Isolamento Multi-tenant (RLS)

### O que foi feito:
- [x] Importação do núcleo testado de `docs/base-sql/01_nucleo.sql` para [0001_nucleo.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/migrations/0001_nucleo.sql):
  - Enums: `conta_tipo`, `conta_situacao`, `perfil_usuario`, `modulo_sistema`, `processo_status`, `monitoramento_estado`, `papel_processo`.
  - Tabelas fundamentais: `contas`, `usuarios`, `grupos`, `grupo_permissoes`, `usuario_grupos`, `etiquetas`, `processos`, `responsaveis_processo`.
  - Funções com `security definer` e `search_path = public`: `conta_atual()`, `perfil_atual()`, `pode(modulo, acao)`, `pode_ver_processo(processo_id)`.
  - Políticas de Row Level Security (RLS) ativadas em 100% das tabelas para estrito isolamento por `conta_id` e controle de permissões.
- [x] Omissão intencional de `00_local_auth_stub.sql`, utilizando o schema nativo `auth.users` do Supabase.
- [x] Adaptação da suíte de validação de isolamento para [teste_isolamento.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/tests/teste_isolamento.sql):
  - Preenchimento de colunas obrigatórias do `auth.users` (`instance_id`, `aud`, `role`, `encrypted_password`, `email_confirmed_at`, `raw_app_meta_data`, `raw_user_meta_data`).
  - Simulação de claims JWT de sessão com `request.jwt.claim.sub` e `request.jwt.claims`.
  - Bateria com 9 casos de teste cobrindo visibilidade cruzada, injeção cross-tenant, permissão de escrita/exclusão, restrição de responsável e escalonamento de privilégios.
- [x] Mapeamento minucioso de discrepâncias e campos complementares entre `01_nucleo.sql` e as seções 3, 4 e 18 do PRD.

## [2026-10-16] Integração com o Banco de Dados Supabase Remoto

### O que foi feito:
- [x] Configuração dos arquivos `.env` (raiz), `apps/web/.env` e `apps/worker/.env` com a URL remota (`https://dvqrlgoqfsxrcjkfytfj.supabase.co`) e a chave anônima (`anon key`).
- [x] Atualização de `apps/web/vite.config.ts` com `envDir: '../../'` para resolução confiável de variáveis de ambiente.
- [x] Teste de conectividade com a API do Supabase remoto:
  - Auth Service (GoTrue) ativo e respondendo (`200 OK`).
  - Sessão e autenticação funcionando via `@supabase/supabase-js`.
- [x] Aplicação e validação da migração [0001_nucleo.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/migrations/0001_nucleo.sql) no banco remoto:
  - Todas as 8 tabelas do núcleo respondendo com status 200 OK (`contas`, `usuarios`, `grupos`, `grupo_permissoes`, `usuario_grupos`, `etiquetas`, `processos`, `responsaveis_processo`).
  - Triggers, tipos enums e políticas de RLS ativas.

## [2026-10-16] Migration 0002: Empresas Monitoradas, Vínculos de Etiquetas e Campos Personalizados

### O que foi feito:
- [x] Criação de [0002_empresas_etiquetas_campos.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/migrations/0002_empresas_etiquetas_campos.sql) contendo:
  - `empresas_monitoradas`: Módulo Protege Empresa (seção 13 do PRD) com `cnpj`, `razao_social`, `nome_fantasia`, `monitoramento_ligado`, `cadastro_automatico` e `pessoa_id` (uuid sem FK, reservado para futura integração).
  - `etiqueta_vinculos`: Vínculo N:N polimórfico entre `etiquetas` existentes e entidades (`processo`, `pessoa`, `contrato`, etc).
  - `campos_personalizados` e `campos_personalizados_valores`: Definições configuráveis pelo dono da conta para processos/pessoas e armazenamento de valores tipados (seções 15.1 e 18).
  - 100% das tabelas criadas com `conta_id`, índices, triggers de `atualizado_em` e políticas de Row Level Security (RLS) usando `conta_atual()` e `pode()`.
  - Validação de integridade sintática e execução dos DDLs via PGlite com 100% de sucesso.
- [x] Mapeamento de campos adicionais previstos nas seções 10, 13 e 18 do PRD para consideração futura da equipe.

## [2026-10-16] Migration 0003: Operações Processuais (Partes, Andamentos, Buscas e Leituras)

### O que foi feito:
- [x] Criação de [0003_partes_andamentos_buscas_leituras.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/migrations/0003_partes_andamentos_buscas_leituras.sql) contendo:
  - `partes_processo`: Partes oficiais e manuais (`nome`, `nome_manual`, `polo`, `polo_manual`, `advogados`, `pessoa_id` sem FK, `origem`).
  - `andamentos`: Movimentações processuais com unicidade `(conta_id, fonte, id_externo)` para evitar duplicidade de importação de fontes oficiais (DataJud).
  - `pedidos_busca`: Fila de consultas do DataJud com estados do PRD 5.2 (`em_processamento`, `processada`, `monitorando`, `nao_monitorada`, `erro`, `arquivada`).
  - `leituras`: Rastreamento individual de leitura por usuário para andamentos e publicações com unicidade `(item_tipo, item_id, usuario_id)`.
  - Row Level Security (RLS) habilitado em 100% das tabelas, associado a `conta_atual()`, `pode()` e `pode_ver_processo(processo_id)`.
  - Preservação da regra da Seção 18 do PRD: dados oficiais nunca sobrescritos por edições manuais (colunas `*_manual`).
- [x] Validação sintática e de isolamento RLS:
  - Execução encadeada das migrações 0001, 0002 e 0003 no PGlite.
  - Execução dos testes de isolamento com resultado: `TODOS OS TESTES DE ISOLAMENTO PASSARAM`.

## [2026-10-16] Migration 0004: Publicações (DJEN), Distribuições e Termos Vigiados

### O que foi feito:
- [x] Criação de [0004_publicacoes_distribuicoes_termos.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/migrations/0004_publicacoes_distribuicoes_termos.sql) contendo:
  - `termos_vigiados`: Monitoramento por tipo (`nome`, `advogado`, `oab`, `cnpj`), arrays de `variacoes` e `palavras_ignorar`, status `ativo`, `ultima_consulta_em` e `usuario_id` do criador.
  - `termo_vigiado_destinatarios`: Vínculo N:N para usuários que recebem alertas instantâneos de cada termo.
  - `publicacoes`: Caixa de entrada do DJEN com `id_comunicacao` único por conta, dados do órgão/tribunal, `data_disponibilizacao`, `teor`, `numero_cnj_citado`, `situacao` (`nova`, `lida`, `arquivada`), `tipo_vinculo` (`automatico`, `manual`, `nenhum`) e vínculo opcional a `processos`.
  - `publicacao_termos`: Relacionamento N:N rastreando quais termos vigiados capturaram a comunicação oficial.
  - `distribuicoes`: Caixa de triagem de novos processos com unicidade `(conta_id, numero_cnj)` e estados (`caixa`, `arquivada`, `ignorada`, `aceita`).
  - Índices de performance solicitados para a caixa de publicações: `(conta_id, situacao, data_disponibilizacao desc)` e `(conta_id, numero_cnj_citado)`.
  - Row Level Security (RLS) completo com herança de visualização de processos (`pode_ver_processo`), controle de módulo (`publicacoes` e `processos`) e `conta_atual()`.
- [x] Validação sintática e de isolamento RLS:
  - Execução encadeada de todas as 4 migrações (0001 a 0004) no PGlite.
  - Execução da suíte de testes de isolamento com resultado: `TODOS OS TESTES DE ISOLAMENTO PASSARAM`.

## [2026-10-16] Migration 0005: GED (Pastas, Arquivos, Versões, Modelos) e Avisos/Notificações

### O que foi feito:
- [x] Criação de [0005_ged_modelos_avisos.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/migrations/0005_ged_modelos_avisos.sql) contendo:
  - `ged_pastas`: Estrutura hierárquica em árvore e pastas automáticas associadas a processos (com `processo_id` cascade).
  - `ged_arquivos`: Metadados dos documentos com referência a objetos do Supabase Storage (`caminho_storage`), tamanho, tipo MIME, controle de versão atual e exclusão suave por 30 dias.
  - `ged_versoes`: Histórico completo de versões anteriores para auditoria, download e restauração.
  - `modelos_documento`: Modelos de texto estruturados com suporte a variáveis automáticas e distinção entre modelos nativos do sistema (`sistema`) e customizados da conta (`conta`).
  - `avisos`: Registro centralizado de notificações enviadas via WhatsApp, e-mail e sino interno com status (`enviado`, `entregue`, `lido`, `falhou`) e identificador polimórfico sem chave estrangeira (`referencia_tipo`, `referencia_id`).
  - `preferencias_aviso`: Configuração granular por usuário dos canais de notificação desejados por tipo de evento e janelas de horário de silêncio.
  - Row Level Security (RLS) habilitado em 100% das tabelas, associado a `conta_atual()`, `pode()`, `perfil_atual()` e `pode_ver_processo(processo_id)`.
- [x] Validação sintática e de isolamento RLS:
  - Execução encadeada de todas as 5 migrações (0001 a 0005) no PGlite.
  - Execução da suíte de testes de isolamento com resultado: `TODOS OS TESTES DE ISOLAMENTO PASSARAM`.

## [2026-10-16] Migration 0006: Auditoria, Consultas Externas, Acessos e Expurgo da Lixeira

### O que foi feito:
- [x] Criação de [0006_auditoria_consultas_expurgo.sql](file:///c:/Users/eu/Documents/P4D/Projetos/Protege%20ADV/supabase/migrations/0006_auditoria_consultas_expurgo.sql) contendo:
  - `consultas_externas`: Telemetria de integrações com DataJud, DJEN e fontes externas (fonte, alvo, início, duração em ms, resultado e detalhes jsonb).
  - `registro_atividade`: Trilha de auditoria completa (RF-CFG-04) em modelo append-only (quem, ação, entidade, entidade_id e detalhes jsonb).
  - `registro_acesso`: Histórico e tentativas de login com IP, user-agent e resultado para conformidade LGPD e RNF-SEG-03.
  - Função `expurgar_registros_excluidos()`: Rotina com `security definer` que apaga definitivamente pastas processuais e arquivos do GED que estejam na lixeira (`excluido_em`) há mais de 30 dias (PRD 17.5).
  - Políticas de RLS habilitadas em todas as tabelas (com logs protegidos contra edição e exclusão por usuários autenticados).
- [x] Validação sintática e de isolamento RLS:
  - Execução encadeada de todas as 6 migrações (0001 a 0006) no PGlite.
  - Execução da função `expurgar_registros_excluidos()`.
  - Execução da suíte de testes de isolamento com resultado: `TODOS OS TESTES DE ISOLAMENTO PASSARAM`.

## [2026-10-16] Seed Multi-tenant com 2 Contas, Documentação do Banco (docs/BANCO.md) e Geração de Tipos

### O que foi feito:
- [x] Criação de `supabase/seed.sql` com dados fictícios para 2 contas completas:
  - **Conta 1 (Escritório):** `Silva & Associados Advocacia` (`tipo = escritorio`) com 3 usuários (`dono`, `advogado`, `estagiario`).
  - **Conta 2 (Empresa):** `TechCorp Brasil Logística S.A.` (`tipo = empresa`) com 3 usuários (`dono`, `advogado`, `leitura`).
  - **40 Processos (20 por conta):** Números CNJ matematicamente válidos e inventados com 20 dígitos numéricos estritos (`^[0-9]{20}$`).
  - **Preenchimento de 100% das 30 tabelas ativas** criadas nas migrações 0001 a 0006 (`processos`, `partes_processo`, `andamentos`, `pedidos_busca`, `leituras`, `empresas_monitoradas`, `termos_vigiados`, `termo_vigiado_destinatarios`, `publicacoes`, `publicacao_termos`, `distribuicoes`, `ged_pastas`, `ged_arquivos`, `ged_versoes`, `modelos_documento`, `avisos`, `preferencias_aviso`, `etiquetas`, `etiqueta_vinculos`, `campos_personalizados`, `campos_personalizados_valores`, `consultas_externas`, `registro_atividade`, `registro_acesso`, `contas`, `usuarios`, `grupos`, `grupo_permissoes`, `usuario_grupos`, `responsaveis_processo`).
  - As tabelas de `pessoas`, `compromissos` e `contratos` foram mantidas fora do seed conforme previsto para a Fase 8.
- [x] Criação de `docs/BANCO.md`:
  - Relação exaustiva de todas as 30 tabelas com uma frase explicativa de seu propósito de negócio.
  - Diagrama relacional de Entidade-Relacionamento em sintaxe Mermaid (`erDiagram`).
  - Resumo de conformidade com regras de RLS, segurança e expurgo.
- [x] Geração e validação dos tipos TypeScript do Supabase:
  - Criação do gerador universal `scripts/db_types.mjs` com fallback automático via PGlite para ambientes sem Docker Desktop.
  - Atualização de `packages/shared/src/database.types.ts` com todas as 30 tabelas, colunas, enums e funções.
  - `pnpm db:types`, `pnpm typecheck`, `pnpm lint` e `pnpm test` executados com 100% de aprovação.

## [2026-11-05] Inicialização do Versionamento Git e Auditoria de Segurança

### O que foi feito:
- [x] Auditoria estrita do `.gitignore` garantindo a exclusão de `.env`, `.env.*`, `node_modules`, `dist`, `.turbo`, `.cache` e temporários, preservando `.env.example`.
- [x] Verificação e confirmação de isolamento: todos os arquivos `.env` (raiz, `apps/web/.env`, `apps/worker/.env`) devidamente ignorados pelo Git.
- [x] Varredura pré-commit de segredos, tokens JWT (`eyJ`), chaves `service_role` e senhas em arquivos versionados: zero segredos detectados.
- [x] Configuração da branch principal `main` e criação do commit inicial:
  - Commit único consolidando as etapas iniciais: `base inicial: fases 0 a 2 parciais`.
- [x] **Atenção sobre Integrações e Migrations:**
  - O MCP do Supabase (`supabase-mcp-server`) está apontando para o projeto errado (`qlrxponkhpvfvepnxmzo`) e **NÃO deve ser usado para aplicar migrations**.
  - A aplicação das migrations `0002` a `0006` e do `seed.sql` deve ser feita manualmente via SQL Editor no dashboard oficial do projeto dev (`dvqrlgoqfsxrcjkfytfj`).

## [2026-11-05] Conclusão das Migrations 0007, 0008 e 0009: Pessoas, Agenda e Contratos

### O que foi feito:
- [x] Criação da migration `0007_pessoas.sql` (Módulo 10 do PRD):
  - Tabelas `pessoas`, `pessoa_contatos` e `pessoa_outros_nomes`.
  - Unicidade de `cpf_cnpj` por conta quando preenchido e não excluído.
  - Vínculos e FKs adicionados via `ALTER TABLE` em `partes_processo` e `empresas_monitoradas`.
  - RLS ativada com 4 políticas CRUD completas em todas as tabelas.
- [x] Criação da migration `0008_agenda.sql` (Módulo 9 do PRD):
  - Tabelas `compromissos`, `compromisso_envolvidos` e `feriados`.
  - Herança de visibilidade processual: compromisso e envolvidos só visíveis a quem tem acesso ao processo (`pode_ver_processo`).
  - Gestão de feriados com abrangência nacional, estadual, municipal e por tribunal isolada por conta.
  - RLS ativada com 4 políticas CRUD completas em todas as tabelas.
- [x] Criação da migration `0009_contratos.sql` (Módulo 12 do PRD):
  - Tabelas `contratos`, `contrato_partes` e `contrato_processos`.
  - Bloqueio estrito de estagiário e somente leitura via RLS (`perfil_atual() in ('dono', 'advogado')`).
  - Unicidade de código de contrato por conta.
  - RLS ativada com 4 políticas CRUD completas em todas as tabelas.
- [x] Atualização de `supabase/seed.sql` com cobertura de 100% das 39 tabelas para ambas as contas (Silva & Associados e TechCorp), incluindo 4 contratos e compromissos com processos.
- [x] Regeração dos tipos TypeScript via `pnpm db:types` (`packages/shared/src/database.types.ts`).
- [x] Atualização dos documentos `docs/BANCO.md`, `docs/DECISOES.md` (ADRs 007, 008 e 009) e `docs/PROGRESSO.md`.

### Próximos passos:
- [ ] Aplicar as migrations `0002` até `0009` e o `seed.sql` no SQL Editor do Supabase Dashboard (projeto remoto).
- [ ] Implementar casca de navegação do front-end (`apps/web`) seguindo `docs/DESIGN.md` (tema escuro com roxo, sem gráficos).
- [ ] Implementar Caixa de Entrada de Publicações (Módulo 7 do PRD).



