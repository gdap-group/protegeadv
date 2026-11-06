# Registro de Decisões Arquiteturais (ADR) — Protege ADV & Protege Empresa

Este documento registra as decisões técnicas, arquiteturais e de design tomadas no projeto, bem como seus motivos e impactos.

---

## Resumo das Escolhas Principais
- **Monorepo com pnpm:** Instalação ultra-rápida, deduplicação de dependências via hard links e gestão segura de pacotes locais via `workspace:*`.
- **packageManager no package.json:** Fixa a versão exata do pnpm (`pnpm@10.17.1`), garantindo compatibilidade determinística com `pnpm/action-setup` no CI do GitHub Actions sem duplicar chaves.
- **Vitest:** Execução de testes em ESM nativo com suporte direto a TypeScript e ambientes isolados (`jsdom` e `node`) em workspaces.
- **CI (GitHub Actions):** Automação em todo push e pull request com cache de dependências que bloqueia qualquer falha de lint, typecheck ou teste.
- **Teste de Isolamento Universal no CI:** Validação de 100% das tabelas do schema public via catálogo do PostgreSQL (`pg_class` e `pg_policy`) executada em PGlite ou Supabase via `pnpm test:db`.
- **Visibilidade Granular de Contratos (ADR 011):** Função `pode_ver_contrato()` com `security definer` para evitar recursão de RLS e garantir restrição de visualização para advogados restritos, partes e criador.
- **Aderência Estrita ao PRD em Contratos:** Remoção de `contratos.valor` em conformidade com as Seções 12 e 18 do PRD.
- **Região de Ambientes e Teste de Isolamento Remoto (ADR 012):** Projeto dev (`dvqrlgoqfsxrcjkfytfj`) em `us-east-1` tolerado exclusivamente para testes e homologação com dados sintéticos, mantendo a obrigatoriedade estrita de `sa-east-1` (São Paulo) para produção conforme PRD 19. Validação de isolamento executada contra o banco real via `pnpm test:db:remoto`.
- **Tema Canônico e Governança de Cores (ADR 013):** Centralização de 100% dos tokens de cores em `apps/web/src/theme.css` com 13 cores exatas, fontes locais `@fontsource` (Inter e JetBrains Mono), rota de homologação `/_design` (DEV only) e teste automatizado bloqueante contra cores hex/rgb literais fora do tema.
- **Componentes Base e Acessibilidade WAI-ARIA (ADR 014):** Biblioteca de 17 componentes em `apps/web/src/components/ui` com Radix UI, TanStack Table e shadcn/ui. Contraste mínimo de 4,5:1 (Button primary com fundo `#7C3AED` a 5,7:1, links em cards com `#A78BFA`), badges multimodais com ícone e texto, e 100% de cobertura com vitest-axe.
- **Casca do Sistema, Menu e Busca Global (ADR 015):** Layout principal com Sidebar colapsável e persistida em localStorage, gaveta Sheet para mobile (< 768px), paleta de comandos via `cmdk` (Ctrl+K), PermissoesProvider alinhado ao enum `modulo_sistema`, correção de contraste do Button primary no hover (fundo `#7C3AED` + glow a 5,7:1) e páginas-esqueleto sem dados falsos.
- **Modelos Reutilizáveis de Página (ADR 016):** Modelos PaginaLista, PaginaDetalhe e FormularioEmPainel (com validação Zod traduzida e alerta de perda de dados isDirty), integrando TanStack Table, Sheet e acessibilidade WAI-ARIA sem dados falsos em produção.
- **Rota e Arquitetura de Demonstração Comercial (/demo) (ADR 017):** Rota interativa isolada para apresentação comercial com dados 100% fictícios restritos a `apps/web/src/demo/`, controlada por `VITE_MODO_DEMO=true`, tree-shaking comprovado na compilação padrão e exclusão obrigatória e programada para o Passo 10.5.
- **Provedor Global de Tooltip, ErrorBoundary e Fallback de Demonstração (ADR 018):** `TooltipProvider` centralizado na raiz de `App.tsx` prevenindo quebras em visualizações estreitas/recolhidas, `ErrorBoundary` estilizado no tema para captura resiliente de falhas de renderização, e página informativa amigável para `/demo` desligada em ambiente de desenvolvimento com exclusão comprovada no bundle de produção.

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

---

## ADR 010: Teste Dinâmico Universal de Isolamento e RLS via Catálogo
- **Status:** Aceito
- **Contexto:** Garantir que nenhuma tabela do banco passe para homologação/produção sem RLS habilitado ou sem políticas estritas de isolamento por `conta_id`, independente de futuras migrações criarem novas tabelas.
- **Decisão:** Criação de `supabase/tests/teste_isolamento_completo.sql` e do runner `scripts/run_test_db.mjs` (`pnpm test:db`), inspecionando dinamicamente `pg_class` e `pg_policy` para todas as tabelas de `public`.
- **Motivo:** Detecção antecipada e determinística de falhas de segurança no CI antes de qualquer merge ou deploy, sem depender de testes manuais tabela por tabela.

---

## ADR 011: Visibilidade Granular de Contratos via Função Security Definer e Remoção de Campo Inexistente no PRD
- **Status:** Aceito
- **Contexto:**
  1. A auditoria de RLS revelou que advogados restritos (`restringir_a_responsavel = true`) visualizavam contratos e vínculos de `contrato_processos` associados a processos restritos.
  2. Políticas diretas com subconsultas cruzadas entre `contratos` e `contrato_processos` causam recursão infinita no PostgreSQL (`infinite recursion detected in policy for relation ...`).
  3. A coluna `contratos.valor` foi criada na migration 0009 mas não existe no PRD (Seção 12 e Seção 18 afirmam expressamente que o módulo não faz lançamento financeiro).
- **Decisão:**
  1. Implementação de `public.pode_ver_contrato(p_contrato_id uuid)` com `security definer` e `search_path = public`:
     - Dono: vê qualquer contrato da própria conta.
     - Advogado sem restrição: vê qualquer contrato da própria conta.
     - Advogado com restrição: vê o contrato apenas se for o criador (`criado_por = auth.uid()`), for parte em `contrato_partes` (`usuario_id = auth.uid()`), ou se o contrato estiver associado em `contrato_processos` a pelo menos um processo visível via `pode_ver_processo(processo_id)`.
     - Estagiário e leitura: sempre falso.
  2. Adição da coluna `criado_por uuid references usuarios(id) default auth.uid()` em `contratos` e inclusão de `criado_por = auth.uid()` na política `contratos_ver` para garantir compatibilidade imediata com comandos `INSERT ... RETURNING *`.
  3. Aplicação de `pode_ver_contrato()` em todas as políticas de `contratos`, `contrato_partes` e `contrato_processos` (com exigência adicional de `pode_ver_processo(processo_id)` nesta última).
  4. Remoção da coluna `contratos.valor` via `alter table contratos drop column valor` na migration 0010 e ajuste em `seed.sql`.
- **Motivo:** O uso de `security definer` permite que a função avalie a visibilidade de processos e partes sem re-disparar as políticas de RLS das tabelas envolvidas, eliminando recursão cíclica enquanto garante isolamento rigoroso e conformidade absoluta com o PRD.

---

## ADR 012: Região de Ambientes Supabase e Validação de Isolamento no Banco Remoto
- **Status:** Aceito
- **Contexto:**
  1. O projeto remoto Supabase vinculado para desenvolvimento (`dvqrlgoqfsxrcjkfytfj`) foi criado na região `us-east-1` (North Virginia), enquanto a Seção 19 do PRD exige que os servidores fiquem no Brasil (`sa-east-1` - São Paulo).
  2. É crucial validar que as 39 tabelas e 577 regras de RLS operem de forma idêntica e sem anomalias na infraestrutura real hospedada do Supabase (PostgreSQL 17 gerenciado), e não apenas no emulador local PGlite.
- **Decisão:**
  1. Aceitar o projeto dev `dvqrlgoqfsxrcjkfytfj` na região `us-east-1` estritamente para propósitos de testes, desenvolvimento e homologação com dados fictícios (`supabase/seed.sql`). Nenhum dado pessoal ou processual real poderá ser inserido ou trafegar nesta instância.
  2. Reafirmar a exigência mandante do PRD 19 de que o ambiente de Produção (`protege-adv-prod`) deve ser provisionado obrigatoriamente na região `sa-east-1` (São Paulo), prevenindo bloqueios por geolocalização por parte do DJEN, DataJud e tribunais brasileiros, além de conformidade com a LGPD.
  3. Adição do script `pnpm test:db:remoto` (`scripts/run_test_db.mjs --remote`) com validação defensiva do project-ref no `.env`, checagem prévia do schema (39 tabelas e 2 contas) e execução transacional segura com `ROLLBACK` de `teste_isolamento_completo.sql`.
- **Motivo:** Permite avançar no desenvolvimento e validação técnica imediata com o ambiente cloud já ativo, sem custos adicionais de provisionamento imediato de novas instâncias, preservando a governança e o bloqueio estrito para o lançamento produtivo.

---

## ADR 013: Centralização de Tokens, Tema Canônico e Governança Visual no Front-End
- **Status:** Aceito
- **Contexto:** Para garantir que todas as telas subsequentes do Protege ADV possuam consistência visual absoluta e nenhum desenvolvedor ou tela introduza cores arbitrárias fora da paleta do sistema, é necessário um único ponto de verdade (Single Source of Truth) para tokens visuais e testes automatizados de governança.
- **Decisão:**
  1. Centralizar todas as 13 cores canônicas do sistema em `apps/web/src/theme.css` (`bg`, `surface`, `elevated`, `border`, `primary`, `primary-hover`, `glow`, `gradient-from`, `gradient-to`, `text`, `muted`, `success`, `warning`, `danger`).
  2. Provedor de componentes shadcn/ui configurado via `components.json` mapeando as variáveis para compatibilidade nativa.
  3. Tipografia instalada estritamente via `@fontsource/inter` e `@fontsource/jetbrains-mono` em pacotes locais, dispensando CDNs externas para privacidade, performance offline e conformidade estrita.
  4. Padronização de forma e movimento: raio de 12px para cartões, 8px para campos, bordas de 1px, brilho suave em roxo (`glow-card`), transições de 150-200ms, linhas de tabela de 44px e `:focus-visible` roxo em todos os controles interativos.
  5. Criação da rota `/_design` condicionada estritamente a `import.meta.env.DEV` com carregamento dinâmico (`React.lazy`), garantindo que seja removida (tree-shaken) no build de produção.
  6. Criação de teste de regressão estrito em Vitest (`apps/web/src/theme.test.ts`) que inspeciona todos os arquivos de `apps/web/src` e falha se qualquer hexadecimal (`#...`) ou `rgb()/rgba()` for encontrado fora de `theme.css`.
- **Motivo:** Previne desvios visuais, elimina inconsistências entre telas e garante um design system robusto, acessível e auditável antes da construção das funcionalidades de negócio.

---

## ADR 014: Componentes Base, Regras de Contraste e Acessibilidade (Passo 3.2)
- **Status:** Aceito
- **Contexto:**
  1. A construção das telas de negócio requer componentes reutilizáveis, padronizados e com acessibilidade nativa por teclado e leitores de tela.
  2. A regra de contraste WCAG AA impõe mínimo de 4,5:1 para texto normal. Na auditoria do Passo 3.1, o texto branco sobre `#8B5CF6` atingiu 4,23:1 (abaixo do limiar).
  3. Informações de status e prazos não podem depender exclusivamente de cor para transmitir significado (critério WCAG 1.4.1).
- **Decisão:**
  1. Criação dos 17 componentes base em `apps/web/src/components/ui`: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `Badge`, `Card`, `Tabs`, `Dialog`, `Sheet`, `Dropdown`, `Tooltip`, `Toast`, `Skeleton`, `EmptyState` e `DataTable`.
  2. Implementação das regras de contraste:
     - `Button` na variante `primary` utiliza como fundo base a cor `primary-hover` (`#7C3AED`), garantindo contraste de **5,7:1** com texto branco/claro, bem acima dos 4,5:1 exigidos. O estado hover emprega o gradiente canônico de destaque e brilho roxo (`glow-card`).
     - Links e textos secundários de destaque dentro de cartões (`surface`) utilizam a cor `glow` (`#A78BFA`), garantindo legibilidade perfeita sobre fundos escuros.
     - `Badge` implementa variantes com ícones semânticos embutidos (`CheckCircle2`, `AlertTriangle`, `AlertCircle`, `MinusCircle`, `Info`), garantindo redundância visual (ícone + texto) sem dependência exclusiva de cor.
     - Foco roxo visível (`:focus-visible`) configurado em 100% dos controles com `outline: 2px solid var(--color-primary)` e anel offset.
  3. `DataTable` construída sobre `@tanstack/react-table` (v8) com ordenação dinâmica por coluna, paginação e seleção de linhas com checkboxes acessíveis, respeitando a altura de 44px por linha (`.table-row-standard`).
  4. Suíte automatizada de testes com `vitest-axe` cobrindo renderização, atributos ARIA, ausência de violações de acessibilidade e navegação por teclado (`Tab`, `Enter`, `Espaço` e `Esc` em diálogos, painéis laterais e menus dropdown).
- **Motivo:** Fornece os blocos de construção essenciais com conformidade WCAG AA estrita e experiência de usuário de nível startup antes do desenvolvimento das interfaces de processos e publicações.

---

## ADR 015: Arquitetura da Casca do Sistema, Navegação e Busca Global (Passo 3.3)
- **Status:** Aceito
- **Contexto:**
  1. A navegação do sistema precisa suportar os módulos do PRD Seção 2, oferecendo acesso rápido tanto em telas grandes quanto em dispositivos móveis, sem vazamento de módulos não autorizados.
  2. No Passo 3.2, o estado hover do `Button primary` usava gradiente de destaque, o que reduzia ligeiramente o contraste do texto branco.
  3. A aplicação precisa de um mecanismo de busca global por teclado (`Ctrl+K`/`Cmd+K`) para navegação instantânea entre módulos operacionais.
- **Decisão:**
  1. **Correção de Contraste no Button Primary:** O estado hover mantém rigorosamente o fundo `primary-hover` (`#7C3AED`), acrescentando apenas a sombra de brilho roxo (`shadow-[var(--shadow-glow)]`), garantindo que o texto branco/claro mantenha a taxa de **5,7:1** tanto no estado normal quanto no hover.
  2. **Casca do Sistema (`MainLayout`):** Estrutura envolvente com `Sidebar` desktop recolhível, `Header` com busca e notificações, e área de conteúdo flexível. A rota inicial `/` redireciona automaticamente para `/processos`, e a rota `/_design` permanece isolada fora da casca e restrita a `import.meta.env.DEV`.
  3. **Persistência de Estado do Menu:** O estado recolhido/expandido do menu lateral é persistido em `localStorage` sob a chave `protege_sidebar_collapsed` com tratamento defensivo de erro (`try/catch`) para navegação anônima/privada.
  4. **Camada de Permissões desacoplada (`PermissoesProvider`):** Hook `useModulosPermitidos()` consome módulos baseados no enum `modulo_sistema` do banco de dados PostgreSQL. Oculta da navegação e da paleta de comandos itens que o usuário não pode acessar, mantendo nota explícita de que a segurança real de dados é provida pelas políticas de RLS.
  5. **Busca Global (`CommandPalette`):** Implementada com a biblioteca acessível `cmdk`, ativada por `Ctrl+K` e `Cmd+K`, filtrada pelos módulos permitidos e fechada com `Escape`.
  6. **Avisos e Usuário:** Sino na barra superior abre gaveta com `EmptyState` ("Nenhum aviso por enquanto"), e menu do usuário exibe rótulo estático "Minha conta" com itens desabilitados (sem dados falsos), a serem ligados à autenticação do Passo 2.4.
  7. **Responsividade Mobile:** Em telas < 768px, a barra lateral oculta-se e um botão na barra superior aciona a gaveta lateral (`Sheet side="left"`).
- **Motivo:** Estabelece a infraestrutura ergonômica, consistente e acessível da aplicação antes da integração dos dados de processos e publicações.

---

## ADR 016: Modelos Reutilizáveis de Página — Lista, Detalhe e Formulário em Painel (Passo 3.4)
- **Status:** Aceito
- **Contexto:**
  1. A implementação dos módulos de negócio (Processos, Publicações, Pessoas, Contratos, etc.) requer templates de interface padronizados para garantir coerência visual, ergonomia operacional e economia de código.
  2. Formulários precisam de validação em tempo real com mensagens amigáveis em português, sem vazamento de jargões técnicos em inglês do Zod.
  3. Usuários precisam ser prevenidos contra perda acidental de dados preenchidos ao fechar gavetas laterais de formulário.
  4. Páginas de listagem e detalhe precisam tratar todos os estados assíncronos (carregamento com Skeleton, listas vazias, erros com retry) e adaptar-se com elegância entre desktop e telas móveis.
- **Decisão:**
  1. **Modelo `PaginaLista` (`apps/web/src/components/patterns/PaginaLista.tsx`):**
     - Estrutura combinando `PageHeader`, ação principal configurável, barra de filtros unificada (busca textual com ícone de lupa e pills de filtros rápidos com badges numéricos de contagem).
     - Integração nativa com `DataTable` (ordenação, paginação, seleção por checkbox).
     - Tratamento completo dos quatro estados: normal, carregando (placeholder estruturado com `Skeleton`), vazio (`EmptyState` acessível com ação primária) e erro (banner com alerta visual, texto explicativo em português e botão "Tentar de novo").
  2. **Modelo `PaginaDetalhe` (`apps/web/src/components/patterns/PaginaDetalhe.tsx`):**
     - Cabeçalho de identificação com título da demanda, subtítulo com identificador numérico em fonte mono (`font-mono` para números CNJ), badge de situação com redundância de ícone e texto, breadcrumbs e botões de ação.
     - Navegação por abas (`Tabs`) com suporte a contadores de registros e ícones em cada aba.
     - Card lateral de dados rápidos com pares rótulo/valor e rodapé de ações, com layout responsivo que empilha automaticamente abaixo do conteúdo principal em visualizações móveis (`< 768px`).
  3. **Modelo `FormularioEmPainel` (`apps/web/src/components/patterns/FormularioEmPainel.tsx`):**
     - Gaveta lateral (`Sheet side="right"`) combinando `react-hook-form` e `@hookform/resolvers/zod`.
     - Validação reativa (`mode: 'onBlur', reValidateMode: 'onChange'`), botão "Salvar" com estado visual de processamento (`loading={isSubmitting}`), botão "Cancelar" e foco automático no primeiro elemento inválido na tentativa de submissão.
     - Prevenção de perda de dados: intercepta tentativas de fechamento (clique no botão Cancelar, clique fora no overlay ou tecla `Esc`) quando o formulário possui alterações (`isDirty`), disparando modal de confirmação ("Descartar alterações?") antes de fechar.
  4. **Mapa de Mensagens Zod em Português (`zod-pt.ts`):**
     - Módulo configurado em `packages/shared/src/zod-pt.ts` e exportado para `apps/web/src/lib/zod-pt.ts`, traduzindo automaticamente validações de tipo, campos vazios/obrigatórios, formatos de e-mail e limites numéricos/textuais para o português do Brasil.
  5. **Demonstração e Governança:**
     - Demonstração interativa dos três modelos adicionada na Seção 9 de `apps/web/src/pages/DesignPage.tsx`, com dados ilustrativos restritos à rota `/_design` e aos testes.
     - Suíte de testes com Vitest, Testing Library e `vitest-axe` comprovando ausência de violações de acessibilidade (`axe`), conformidade estrita de contraste, ordem de cabeçalhos (`h1 -> h2`) e navegação completa por teclado (`Tab`, `Enter`, `Esc`).
     - Teste de governança de cores (`theme.test.ts`) mantido com 100% de sucesso (zero valores literais hexadecimais ou rgb fora de `theme.css`).
- **Motivo:** Acelera a entrega dos passos seguintes com componentes de alto nível consistentes, acessíveis e à prova de regressão.

---

## ADR 017: Rota e Arquitetura de Demonstração Interativa (/demo) e Exclusão Obrigatória no Passo 10.5
- **Status:** Aceito
- **Contexto:**
  1. Para fins de apresentação comercial e alinhamento de produto com potenciais clientes e partes interessadas, a aplicação precisa ser navegável com volume representativo de dados judiciais (processos, publicações do DJEN, prazos na agenda e diretório de partes).
  2. No entanto, o sistema real ainda não possui a integração dos módulos de negócio das fases subsequentes (Fases 4 a 9) e **nenhum dado fictício pode residir nos arquivos de produção** ou poluir os modelos de negócio reais.
  3. É imperativo que a demonstração não pareça obsoleta no futuro (datas de prazos judiciais e intimações devem ser dinâmicas e sempre contemporâneas à data da demonstração) e que os números de processo CNJ fictícios sejam válidos segundo o algoritmo de dígito verificador módulo 97 (`validarNumeroCNJ`).
- **Decisão:**
  1. **Isolamento de Código e Dados:** Todos os dados fictícios foram concentrados em um único arquivo: `apps/web/src/demo/dados-demo.ts`. Nenhum outro arquivo de produção fora da pasta `apps/web/src/demo` possui permissão para importar esse arquivo (validado por teste de regressão estrito em Vitest).
  2. **Datas Relativas e CNJs Válidos:** Todas as datas de intimações, andamentos e prazos utilizam função utilitária `diasRelativos(n)` que calcula offsets em relação ao momento da execução (`new Date()`), garantindo que prazos em aberto, vencidos e futuros estejam sempre calibrados no momento da apresentação. Todos os CNJs fictícios foram gerados e verificados com a função oficial `validarNumeroCNJ` de `@protege/shared`.
  3. **Banner de Transparência e Casca Dedicada:** Toda tela de demonstração renderiza no topo um banner fixo e visível: *"Demonstração com dados fictícios"*. O layout conta com navegação lateral personalizada e contador dinâmico de publicações não lidas no menu.
  4. **Ativação Condicional e Tree-Shaking:**
     - A rota `/demo` é ativada exclusivamente quando a variável de ambiente `VITE_MODO_DEMO=true` estiver definida.
     - A importação do módulo de demonstração em `apps/web/src/App.tsx` utiliza `React.lazy` associado a `import.meta.env.VITE_MODO_DEMO === 'true'`.
     - Quando `VITE_MODO_DEMO=false` (ou em build de produção padrão), o Rollup / Vite substitui a expressão por `false` e remove integralmente o código de `/demo`, os dados mockados e o banner da compilação final (testado e comprovado via verificação nos bundles de saída).
  5. **Compromisso de Remoção Mandatória no Passo 10.5:**
     - A rota `/demo`, o diretório `apps/web/src/demo` e a flag `VITE_MODO_DEMO` têm existência **estritamente temporária**.
     - No **Passo 10.5** (Limpeza Final e Hardening pré-entrega), todo o diretório `apps/web/src/demo`, suas referências no `App.tsx`, na configuração de ambiente e nos testes serão **definitiva e completamente removidos do repositório**, deixando a base 100% limpa para operação em produção.
- **Motivo:** Permite conduzir demonstrações comerciais ricas, dinâmicas e realistas durante a fase de desenvolvimento, mantendo estrita conformidade com as regras de governança, sem risco de vazamento de dados fictícios para o produto final.

---

## ADR 018: Provedor Global de Tooltip, ErrorBoundary e Fallback Informativo de Demonstração Desligada
- **Status:** Aceito
- **Contexto:**
  1. Ao abrir a aplicação em larguras estreitas (376px — modo celular) ou com a barra lateral recolhida (`protege_sidebar_collapsed = 'true'`), o componente `Sidebar` desktop continuava montado no Virtual DOM (oculto apenas via CSS `hidden md:block`) e renderizava `<Tooltip>` para cada item de navegação.
  2. Como nenhum `TooltipProvider` envolvia a raiz da aplicação (`App.tsx`), a biblioteca Radix UI disparava a exceção fatal `Uncaught Error: Tooltip must be used within TooltipProvider`.
  3. Sem um `ErrorBoundary` na árvore de componentes React, a exceção descarregava a árvore inteira, provocando tela preta sem feedback ao usuário.
  4. Em desenvolvimento, ao acessar `/demo` com a flag `VITE_MODO_DEMO` desligada, a aplicação redirecionava silenciosamente para `/processos`, sem orientar o desenvolvedor sobre como habilitar a demonstração comercial.
- **Decisão:**
  1. **Centralização do `TooltipProvider`:** Inserção de um único `TooltipProvider` com `delayDuration={200}` na raiz de `apps/web/src/App.tsx`, cobrindo globalmente a casca operacional, a demonstração comercial e a rota `/_design`. Provedores duplicados em `DesignPage.tsx` foram removidos.
  2. **Implementação de `ErrorBoundary` Global (`apps/web/src/components/ErrorBoundary.tsx`):**
     - Captura exceções não tratadas de renderização de componentes filhos via `componentDidCatch` e `getDerivedStateFromError`.
     - Registra o erro detalhado no console do navegador (`console.error`).
     - Renderiza tela no tema escuro oficial do sistema com aviso amigável em português: *"Algo deu errado. Recarregue a página."* e botão "Recarregar" que executa `window.location.reload()`, impedindo telas pretas silenciosas.
  3. **Página Informativa de Demonstração Desligada (`apps/web/src/pages/DemoDesligadaPage.tsx`):**
     - Em ambiente de desenvolvimento (`import.meta.env.DEV`), caso `/demo` seja acessada sem `VITE_MODO_DEMO=true`, exibe mensagem explicativa: *"A demonstração está desligada. Defina VITE_MODO_DEMO=true em apps/web/.env e reinicie o servidor."*.
     - Condicionada estritamente a `import.meta.env.DEV`, sendo 100% eliminada via tree-shaking pelo Rollup no build de produção.
  4. **Acessibilidade em Links de Menu Recolhidos:** Adição de `aria-label={isCollapsed && !isMobileDrawer ? item.title : undefined}` em `Sidebar.tsx` para assegurar que leitores de tela identifiquem links de ícones isolados sem quebra de acessibilidade WAI-ARIA.
- **Motivo:** Garante robustez contra falhas de contexto do Radix UI, elimina telas pretas inesperadas com tratamento de erro resiliente e melhora a experiência de desenvolvimento e homologação da demonstração.





