# Guia de Ambientes e Supabase — Protege ADV & Protege Empresa

Este guia descreve, passo a passo e de forma simples, como configurar os ambientes de desenvolvimento local, homologação/dev e produção no Supabase, garantindo a conformidade com as regras de hospedagem no Brasil (São Paulo).

---

## 1. Criar os Projetos na Nuvem do Supabase (Região São Paulo)

Conforme a seção 19 do PRD, os servidores e bancos do sistema devem estar obrigatoriamente localizados no Brasil para evitar bloqueios das fontes judiciais nacionais (DJEN/DataJud).

Siga os passos:

1. Acesse o painel oficial do Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard) e faça login.
2. Clique no botão verde **"New Project"**.
3. Selecione a sua organização (Organization).
4. Crie o projeto de **Desenvolvimento / Homologação**:
   - **Name:** `protege-adv-dev`
   - **Database Password:** Escolha uma senha forte e guarde-a com segurança em seu gerenciador de senhas.
   - **Region:** Selecione **`South America (São Paulo) - sa-east-1`** (Obrigatório).
   - **Pricing Plan:** Free ou Pro conforme seu plano.
   - Clique em **"Create new project"** e aguarde 1 a 2 minutos até o provisionamento concluir.
5. Repita o processo para criar o projeto de **Produção**:
   - **Name:** `protege-adv-prod`
   - **Database Password:** Escolha outra senha segura.
   - **Region:** Selecione **`South America (São Paulo) - sa-east-1`** (Obrigatório).
   - Clique em **"Create new project"**.
6. Em cada projeto criado, anote o **Reference ID** (o código alfanumérico que aparece na URL do painel, ex: `abcdefghijklmnopqrst`).

---

## 2. Autenticar o Supabase CLI e Ligar ao Projeto Dev

Para aplicar migrations e sincronizar o esquema com o projeto remoto, você precisa vincular o CLI local ao projeto de desenvolvimento (`protege-adv-dev`).

1. Abra o terminal na raiz do projeto `Protege ADV`.
2. Faça login na sua conta Supabase pelo CLI:
   ```bash
   supabase login
   ```
   *Uma janela do navegador será aberta para autorizar o token de acesso pessoal.*
3. Vincule seu ambiente local ao projeto de desenvolvimento:
   ```bash
   supabase link --project-ref SEU_PROJECT_REF_DEV
   ```
   *(Substitua `SEU_PROJECT_REF_DEV` pelo Reference ID obtido no passo 1).*
4. Digite a senha do banco de dados que você definiu ao criar o projeto `protege-adv-dev`.
5. O CLI confirmará o vínculo: `Finished supabase link.`

---

## 3. Subir o Banco de Dados Local (Desenvolvimento Local)

O desenvolvimento diário utiliza uma instância local do Supabase rodando em containers Docker.

1. **Pré-requisito:** Certifique-se de que o **Docker Desktop** esteja instalado e em execução no seu computador.
2. Na raiz do projeto, execute o script configurado no `package.json`:
   ```bash
   pnpm db:start
   ```
   *(Ou execute diretamente `supabase start`).*
3. O Supabase baixará e iniciará os serviços (PostgreSQL, Auth, Storage, Studio, Inbucket para e-mails de teste).
4. Ao concluir, o terminal exibirá as URLs locais e credenciais de desenvolvimento:
   - **API URL:** `http://127.0.0.1:54321`
   - **GraphQL URL:** `http://127.0.0.1:54321/graphql/v1`
   - **DB URL:** `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
   - **Studio URL:** `http://127.0.0.1:54323` (Painel visual local do banco)
   - **Inbucket URL:** `http://127.0.0.1:54324` (Caixa de entrada local para e-mails)
   - **anon key:** `sb_publishable_...` (chave pública)
   - **service_role key:** `sb_secret_...` (chave privada restrita para workers/Edge Functions)

### Comandos Rápidos do Banco (Scripts do package.json):
- `pnpm db:start`: Inicia os containers locais do Supabase.
- `pnpm db:stop`: Para os containers locais economizando memória.
- `pnpm db:reset`: Reseta o banco local, reaplica todas as migrations e roda o `supabase/seed.sql`.
- `pnpm db:migrate`: Aplica novas migrations pendentes ao banco.
- `pnpm db:types`: Regenera as tipagens TypeScript do banco em `packages/shared/src/database.types.ts`.

---

## 4. Variáveis de Ambiente Necessárias por Aplicação

Nunca adicione credenciais reais no repositório Git. Crie os arquivos `.env` locais correspondentes usando `.env.example` como guia.

### 4.1 Aplicação Front-End Web (`apps/web`)
No arquivo `apps/web/.env` (ou `.env` na raiz):
```env
# URL da API do Supabase (local ou remota)
# Local: http://127.0.0.1:54321
# Nuvem: https://SEU_PROJECT_REF_DEV.supabase.co
VITE_SUPABASE_URL=http://127.0.0.1:54321

# Chave pública anônima (segura para o browser)
VITE_SUPABASE_ANON_KEY=sua-anon-key-local-ou-remota

# Ambiente da aplicação (development, test, production)
VITE_APP_ENV=development
```

### 4.2 Worker de Coleta em Segundo Plano (`apps/worker`)
No arquivo `apps/worker/.env`:
```env
# Conexão direta com o Supabase
SUPABASE_URL=http://127.0.0.1:54321

# Chave privilegiada (SERVICE ROLE) - NUNCA expor no front-end!
# Usada pelo worker para bypass de RLS na inserção em lote de andamentos e publicações
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui

# Configurações do ciclo de coleta (valores padrão do PRD)
INTERVALO_MINUTOS_DJEN=60
INTERVALO_HORAS_DATAJUD=24

# Chave da API pública do DataJud (CNJ) - lida via env var (RF-INT-06)
DATAJUD_API_KEY=sua-chave-publica-datajud-aqui
```

---

## 5. Resumo das Regras de Segurança
1. A **`anon key`** pode ir para o front-end `apps/web`.
2. A **`service_role key`** NUNCA deve estar no `apps/web` nem ser commitada.
3. Todas as alterações em estruturas de dados devem ser feitas através de migrations versionadas em `supabase/migrations/` e aplicadas com `pnpm db:migrate`.
