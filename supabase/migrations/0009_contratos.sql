-- supabase/migrations/0009_contratos.sql
-- Módulo Contratos: contratos de honorários, partes envolvidas e vínculos com processos
-- Conforme Seção 12 e Seção 18 do PRD

-- ---------------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------------
create type contrato_situacao as enum ('ativo', 'vencido', 'renovado', 'encerrado', 'arquivado');
create type contrato_parte_papel as enum ('contratante', 'contratado', 'responsavel');

-- ---------------------------------------------------------------------------
-- 1. Contratos de Honorários
-- ---------------------------------------------------------------------------
create table contratos (
  id                    uuid primary key default gen_random_uuid(),
  conta_id              uuid not null references contas(id) on delete cascade,
  codigo                text not null,
  descricao             text,
  situacao              contrato_situacao not null default 'ativo',
  data_inicio           date not null,
  data_fim              date,
  renovacao_automatica  boolean not null default false,
  valor                 numeric(14,2),
  arquivo_id            uuid references ged_arquivos(id) on delete set null,
  excluido_em           timestamptz,
  criado_em             timestamptz not null default now(),
  atualizado_em         timestamptz not null default now()
);

comment on table contratos is 'Contratos de honorários firmados com clientes, vigência e avisos de renovação.';
comment on column contratos.codigo is 'Código identificador único do contrato dentro da conta.';

create index contratos_conta_idx on contratos (conta_id);
create unique index contratos_conta_codigo_uidx on contratos (conta_id, codigo)
  where excluido_em is null;

create trigger tr_contratos_atualizado_em
  before update on contratos
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 2. Partes do Contrato (Clientes Contratantes, Contratados e Responsáveis)
-- ---------------------------------------------------------------------------
create table contrato_partes (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas(id) on delete cascade,
  contrato_id   uuid not null references contratos(id) on delete cascade,
  pessoa_id     uuid references pessoas(id) on delete cascade,
  usuario_id    uuid references usuarios(id) on delete cascade,
  papel         contrato_parte_papel not null default 'contratante',
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table contrato_partes is 'Partes do contrato: clientes (pessoas), contratados ou responsáveis internos (usuários).';

create index contrato_partes_conta_idx on contrato_partes (conta_id);
create index contrato_partes_contrato_idx on contrato_partes (contrato_id);
create index contrato_partes_pessoa_idx on contrato_partes (pessoa_id) where pessoa_id is not null;
create index contrato_partes_usuario_idx on contrato_partes (usuario_id) where usuario_id is not null;

create trigger tr_contrato_partes_atualizado_em
  before update on contrato_partes
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 3. Vínculo de Contratos a Processos
-- ---------------------------------------------------------------------------
create table contrato_processos (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas(id) on delete cascade,
  contrato_id   uuid not null references contratos(id) on delete cascade,
  processo_id   uuid not null references processos(id) on delete cascade,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (contrato_id, processo_id)
);

comment on table contrato_processos is 'Associação N:N entre contratos de honorários e pastas processuais.';

create index contrato_processos_conta_idx on contrato_processos (conta_id);
create index contrato_processos_processo_idx on contrato_processos (processo_id);

create trigger tr_contrato_processos_atualizado_em
  before update on contrato_processos
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 4. Row Level Security (RLS) e Políticas
-- Regra mandatória: perfil estagiário e somente leitura são TERMINANTEMENTE BLOQUEADOS
-- em nível de RLS (apenas 'dono' e 'advogado', respeitando pode('contratos', acao)).
-- ---------------------------------------------------------------------------
alter table contratos           enable row level security;
alter table contrato_partes     enable row level security;
alter table contrato_processos  enable row level security;

-- Políticas para contratos
create policy contratos_ver on contratos for select to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'ver')
  );

create policy contratos_criar on contratos for insert to authenticated
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'criar')
  );

create policy contratos_editar on contratos for update to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
  )
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
  );

create policy contratos_excluir on contratos for delete to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'excluir')
  );

-- Políticas para contrato_partes
create policy contrato_partes_ver on contrato_partes for select to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'ver')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  );

create policy contrato_partes_criar on contrato_partes for insert to authenticated
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'criar')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  );

create policy contrato_partes_editar on contrato_partes for update to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  )
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  );

create policy contrato_partes_excluir on contrato_partes for delete to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'excluir')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  );

-- Políticas para contrato_processos
create policy contrato_processos_ver on contrato_processos for select to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'ver')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  );

create policy contrato_processos_criar on contrato_processos for insert to authenticated
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'criar')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  );

create policy contrato_processos_editar on contrato_processos for update to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  )
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  );

create policy contrato_processos_excluir on contrato_processos for delete to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'excluir')
    and exists (
      select 1 from contratos c
       where c.id = contrato_id
         and c.conta_id = conta_atual()
    )
  );

