-- 0002_empresas_etiquetas_campos.sql
-- Migração incremental para: empresas_monitoradas, etiqueta_vinculos,
-- campos_personalizados e campos_personalizados_valores.
-- Segue PRD seções 10, 13, 15.1 e 18.
-- Utiliza conta_atual(), pode() e políticas RLS multi-tenant idênticas ao núcleo.

-- ---------------------------------------------------------------------------
-- 1. Empresas Monitoradas (Protege Empresa - Seção 13 do PRD)
-- ---------------------------------------------------------------------------
create table empresas_monitoradas (
  id                   uuid primary key default gen_random_uuid(),
  conta_id             uuid not null references contas (id),
  cnpj                 text not null check (cnpj ~ '^[0-9]{14}$'),
  razao_social         text not null,
  nome_fantasia        text,
  monitoramento_ligado boolean not null default true,
  cadastro_automatico  boolean not null default false,
  pessoa_id            uuid, -- Vínculo opcional com a futura tabela pessoas (sem chave estrangeira por enquanto)
  criado_em            timestamptz not null default now(),
  atualizado_em        timestamptz not null default now(),
  unique (conta_id, cnpj)
);

comment on table empresas_monitoradas is 'Empresas e filiais monitoradas por CNPJ (Protege Empresa).';
comment on column empresas_monitoradas.cnpj is 'CNPJ da matriz ou filial com 14 dígitos numéricos.';
comment on column empresas_monitoradas.cadastro_automatico is 'Quando verdadeiro, processos confirmados com o CNPJ são cadastrados sem triagem.';
comment on column empresas_monitoradas.pessoa_id is 'Vínculo opcional com a futura tabela pessoas.';

create index empresas_monitoradas_conta_idx on empresas_monitoradas (conta_id);

create trigger t_empresas_monitoradas_atualizado
  before update on empresas_monitoradas
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 2. Vínculos Genéricos de Etiquetas (Seções 10, 11, 12 e 18 do PRD)
-- A tabela etiquetas já existe no núcleo.
-- ---------------------------------------------------------------------------
create table etiqueta_vinculos (
  id          uuid primary key default gen_random_uuid(),
  conta_id    uuid not null references contas (id),
  etiqueta_id uuid not null references etiquetas (id) on delete cascade,
  item_tipo   text not null, -- 'processo', 'pessoa', 'contrato', 'arquivo', 'compromisso'
  item_id     uuid not null,
  criado_em   timestamptz not null default now(),
  unique (conta_id, etiqueta_id, item_tipo, item_id)
);

comment on table etiqueta_vinculos is 'Vínculo N:N polimórfico entre etiquetas e entidades (processos, pessoas, contratos, etc).';

create index etiqueta_vinculos_conta_idx on etiqueta_vinculos (conta_id);
create index etiqueta_vinculos_item_idx on etiqueta_vinculos (conta_id, item_tipo, item_id);

-- ---------------------------------------------------------------------------
-- 3. Definição de Campos Personalizados (Seções 15.1 e 18 do PRD)
-- ---------------------------------------------------------------------------
create table campos_personalizados (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas (id),
  entidade      text not null check (entidade in ('processo', 'pessoa')),
  nome          text not null,
  tipo          text not null check (tipo in ('texto', 'numero', 'data', 'lista')),
  opcoes        jsonb not null default '[]'::jsonb,
  obrigatorio   boolean not null default false,
  ordem         integer not null default 0,
  ativo         boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (conta_id, entidade, nome)
);

comment on table campos_personalizados is 'Campos extras configuráveis pelo dono da conta para processos e pessoas.';
comment on column campos_personalizados.opcoes is 'Lista de valores pré-definidos quando tipo for lista.';

create index campos_personalizados_conta_idx on campos_personalizados (conta_id);

create trigger t_campos_personalizados_atualizado
  before update on campos_personalizados
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 4. Valores dos Campos Personalizados (Seção 18 do PRD)
-- ---------------------------------------------------------------------------
create table campos_personalizados_valores (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas (id),
  campo_id      uuid not null references campos_personalizados (id) on delete cascade,
  item_id       uuid not null,
  valor         text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (conta_id, campo_id, item_id)
);

comment on table campos_personalizados_valores is 'Valores preenchidos dos campos personalizados para cada entidade.';

create index campos_personalizados_valores_conta_idx on campos_personalizados_valores (conta_id);
create index campos_personalizados_valores_item_idx on campos_personalizados_valores (conta_id, item_id);

create trigger t_campos_personalizados_valores_atualizado
  before update on campos_personalizados_valores
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 5. Row Level Security (RLS)
-- ---------------------------------------------------------------------------
alter table empresas_monitoradas           enable row level security;
alter table etiqueta_vinculos              enable row level security;
alter table campos_personalizados          enable row level security;
alter table campos_personalizados_valores  enable row level security;

-- empresas_monitoradas: módulo 'empresa'
create policy empresas_monitoradas_ver on empresas_monitoradas for select to authenticated
  using (conta_id = conta_atual() and pode('empresa', 'ver'));
create policy empresas_monitoradas_criar on empresas_monitoradas for insert to authenticated
  with check (conta_id = conta_atual() and pode('empresa', 'criar'));
create policy empresas_monitoradas_editar on empresas_monitoradas for update to authenticated
  using (conta_id = conta_atual() and pode('empresa', 'editar'))
  with check (conta_id = conta_atual() and pode('empresa', 'editar'));
create policy empresas_monitoradas_excluir on empresas_monitoradas for delete to authenticated
  using (conta_id = conta_atual() and pode('empresa', 'excluir'));

-- etiqueta_vinculos: leitura aberta na conta; mutação para quem edita processos ou pessoas
create policy etiqueta_vinculos_ver on etiqueta_vinculos for select to authenticated
  using (conta_id = conta_atual());
create policy etiqueta_vinculos_criar on etiqueta_vinculos for insert to authenticated
  with check (conta_id = conta_atual() and (pode('processos', 'editar') or pode('pessoas', 'editar') or pode('configuracoes', 'editar')));
create policy etiqueta_vinculos_excluir on etiqueta_vinculos for delete to authenticated
  using (conta_id = conta_atual() and (pode('processos', 'editar') or pode('pessoas', 'editar') or pode('configuracoes', 'editar')));

-- campos_personalizados: definição gerenciada via módulo 'configuracoes'; visível para todos da conta
create policy campos_personalizados_ver on campos_personalizados for select to authenticated
  using (conta_id = conta_atual());
create policy campos_personalizados_criar on campos_personalizados for insert to authenticated
  with check (conta_id = conta_atual() and pode('configuracoes', 'criar'));
create policy campos_personalizados_editar on campos_personalizados for update to authenticated
  using (conta_id = conta_atual() and pode('configuracoes', 'editar'))
  with check (conta_id = conta_atual() and pode('configuracoes', 'editar'));
create policy campos_personalizados_excluir on campos_personalizados for delete to authenticated
  using (conta_id = conta_atual() and pode('configuracoes', 'excluir'));

-- campos_personalizados_valores: mutação para quem pode editar processos ou pessoas
create policy campos_personalizados_valores_ver on campos_personalizados_valores for select to authenticated
  using (conta_id = conta_atual());
create policy campos_personalizados_valores_criar on campos_personalizados_valores for insert to authenticated
  with check (conta_id = conta_atual() and (pode('processos', 'editar') or pode('pessoas', 'editar')));
create policy campos_personalizados_valores_editar on campos_personalizados_valores for update to authenticated
  using (conta_id = conta_atual() and (pode('processos', 'editar') or pode('pessoas', 'editar')))
  with check (conta_id = conta_atual() and (pode('processos', 'editar') or pode('pessoas', 'editar')));
create policy campos_personalizados_valores_excluir on campos_personalizados_valores for delete to authenticated
  using (conta_id = conta_atual() and (pode('processos', 'editar') or pode('pessoas', 'editar')));

-- Permissões de tabela para authenticated (RLS filtra as linhas)
grant select, insert, update, delete on
  empresas_monitoradas, etiqueta_vinculos, campos_personalizados, campos_personalizados_valores
to authenticated;
