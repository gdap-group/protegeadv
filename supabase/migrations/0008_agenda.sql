-- supabase/migrations/0008_agenda.sql
-- Módulo Agenda: compromissos (prazos, audiências, atividades), envolvidos e feriados
-- Conforme Seção 9 e Seção 18 do PRD

-- ---------------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------------
create type compromisso_tipo as enum ('prazo', 'audiencia', 'atividade');
create type compromisso_status as enum ('pendente', 'em_andamento', 'concluido', 'cancelado');

-- ---------------------------------------------------------------------------
-- 1. Compromissos
-- ---------------------------------------------------------------------------
create table compromissos (
  id                uuid primary key default gen_random_uuid(),
  conta_id          uuid not null references contas(id) on delete cascade,
  processo_id       uuid references processos(id) on delete set null,
  publicacao_id     uuid references publicacoes(id) on delete set null,
  tipo              compromisso_tipo not null default 'atividade',
  status            compromisso_status not null default 'pendente',
  titulo            text not null,
  descricao         text,
  data_hora_inicio  timestamptz not null,
  data_hora_fim     timestamptz,
  dia_inteiro       boolean not null default false,
  origem            text not null default 'manual', -- manual ou publicacao
  recorrencia       jsonb, -- regras de repetição
  lembretes         jsonb not null default '[]'::jsonb, -- avisos antes do evento
  concluido_em      timestamptz,
  concluido_por     uuid references usuarios(id) on delete set null,
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

comment on table compromissos is 'Prazos, audiências e atividades vinculados ou não a processos.';
comment on column compromissos.status is 'Estado do compromisso: pendente, em_andamento, concluido ou cancelado.';

create index compromissos_conta_idx on compromissos (conta_id);
create index compromissos_processo_idx on compromissos (processo_id) where processo_id is not null;
create index compromissos_inicio_idx on compromissos (conta_id, data_hora_inicio);

create trigger tr_compromissos_atualizado_em
  before update on compromissos
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 2. Envolvidos no Compromisso (Responsáveis e Participantes)
-- ---------------------------------------------------------------------------
create table compromisso_envolvidos (
  id              uuid primary key default gen_random_uuid(),
  conta_id        uuid not null references contas(id) on delete cascade,
  compromisso_id  uuid not null references compromissos(id) on delete cascade,
  usuario_id      uuid not null references usuarios(id) on delete cascade,
  papel           text not null default 'envolvido', -- 'responsavel' ou 'envolvido'
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  unique (compromisso_id, usuario_id)
);

comment on table compromisso_envolvidos is 'Usuários responsáveis ou envolvidos no compromisso.';

create index compromisso_envolvidos_conta_idx on compromisso_envolvidos (conta_id);
create index compromisso_envolvidos_usuario_idx on compromisso_envolvidos (usuario_id);

create trigger tr_compromisso_envolvidos_atualizado_em
  before update on compromisso_envolvidos
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 3. Feriados e Suspensões de Expediente Forense
-- ---------------------------------------------------------------------------
create table feriados (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas(id) on delete cascade,
  data          date not null,
  descricao     text not null,
  abrangencia   text not null default 'nacional', -- 'nacional', 'estadual', 'municipal', 'tribunal'
  uf            text,
  municipio     text,
  tribunal      text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (conta_id, data, descricao)
);

comment on table feriados is 'Calendário de feriados nacionais, estaduais, municipais e suspensões de prazos da conta.';

create index feriados_conta_idx on feriados (conta_id);
create index feriados_data_idx on feriados (conta_id, data);

create trigger tr_feriados_atualizado_em
  before update on feriados
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 4. Row Level Security (RLS) e Políticas
-- ---------------------------------------------------------------------------
alter table compromissos            enable row level security;
alter table compromisso_envolvidos  enable row level security;
alter table feriados                enable row level security;

-- Políticas para compromissos (visibilidade vinculada a pode_ver_processo quando há processo)
create policy compromissos_ver on compromissos for select to authenticated
  using (
    conta_id = conta_atual()
    and pode('agenda', 'ver')
    and (processo_id is null or pode_ver_processo(processo_id))
  );

create policy compromissos_criar on compromissos for insert to authenticated
  with check (
    conta_id = conta_atual()
    and pode('agenda', 'criar')
    and (processo_id is null or pode_ver_processo(processo_id))
  );

create policy compromissos_editar on compromissos for update to authenticated
  using (
    conta_id = conta_atual()
    and pode('agenda', 'editar')
    and (processo_id is null or pode_ver_processo(processo_id))
  )
  with check (
    conta_id = conta_atual()
    and pode('agenda', 'editar')
    and (processo_id is null or pode_ver_processo(processo_id))
  );

create policy compromissos_excluir on compromissos for delete to authenticated
  using (
    conta_id = conta_atual()
    and pode('agenda', 'excluir')
    and (processo_id is null or pode_ver_processo(processo_id))
  );

-- Políticas para compromisso_envolvidos (garante que não vaza visibilidade através do compromisso pai)
create policy compromisso_envolvidos_ver on compromisso_envolvidos for select to authenticated
  using (
    conta_id = conta_atual()
    and pode('agenda', 'ver')
    and exists (
      select 1 from compromissos c
       where c.id = compromisso_id
         and c.conta_id = conta_atual()
         and (c.processo_id is null or pode_ver_processo(c.processo_id))
    )
  );

create policy compromisso_envolvidos_criar on compromisso_envolvidos for insert to authenticated
  with check (
    conta_id = conta_atual()
    and pode('agenda', 'criar')
    and exists (
      select 1 from compromissos c
       where c.id = compromisso_id
         and c.conta_id = conta_atual()
         and (c.processo_id is null or pode_ver_processo(c.processo_id))
    )
  );

create policy compromisso_envolvidos_editar on compromisso_envolvidos for update to authenticated
  using (
    conta_id = conta_atual()
    and pode('agenda', 'editar')
    and exists (
      select 1 from compromissos c
       where c.id = compromisso_id
         and c.conta_id = conta_atual()
         and (c.processo_id is null or pode_ver_processo(c.processo_id))
    )
  )
  with check (
    conta_id = conta_atual()
    and pode('agenda', 'editar')
    and exists (
      select 1 from compromissos c
       where c.id = compromisso_id
         and c.conta_id = conta_atual()
         and (c.processo_id is null or pode_ver_processo(c.processo_id))
    )
  );

create policy compromisso_envolvidos_excluir on compromisso_envolvidos for delete to authenticated
  using (
    conta_id = conta_atual()
    and pode('agenda', 'excluir')
    and exists (
      select 1 from compromissos c
       where c.id = compromisso_id
         and c.conta_id = conta_atual()
         and (c.processo_id is null or pode_ver_processo(c.processo_id))
    )
  );

-- Políticas para feriados
create policy feriados_ver on feriados for select to authenticated
  using (conta_id = conta_atual() and pode('agenda', 'ver'));

create policy feriados_criar on feriados for insert to authenticated
  with check (conta_id = conta_atual() and pode('agenda', 'criar'));

create policy feriados_editar on feriados for update to authenticated
  using (conta_id = conta_atual() and pode('agenda', 'editar'))
  with check (conta_id = conta_atual() and pode('agenda', 'editar'));

create policy feriados_excluir on feriados for delete to authenticated
  using (conta_id = conta_atual() and pode('agenda', 'excluir'));

