-- 0006_auditoria_consultas_expurgo.sql
-- Auditoria, logs de acesso, consultas externas e rotina de expurgo da lixeira.
-- Contém: consultas_externas, registro_atividade, registro_acesso
-- e a função de expurgo definitivo de registros excluídos (excluido_em > 30 dias).
-- Segue PRD seções 15.1, 15.2, 16.5, 17.5 e 18.
-- RLS com conta_atual(), pode() e perfil_atual().

-- ---------------------------------------------------------------------------
-- 1. Consultas Externas (DataJud, DJEN, APIs Pagas / Data Lake)
-- ---------------------------------------------------------------------------
create table consultas_externas (
  id          uuid primary key default gen_random_uuid(),
  conta_id    uuid not null references contas (id),
  fonte       text not null, -- 'datajud', 'djen', 'judit', 'datalake_cnj'
  alvo        text not null, -- Número do processo, termo, OAB ou CNPJ
  inicio      timestamptz not null default now(),
  duracao_ms  integer,
  resultado   text not null, -- 'sucesso', 'erro', 'nao_encontrado', 'limite_atingido'
  detalhes    jsonb not null default '{}'::jsonb,
  criado_em   timestamptz not null default now()
);

comment on table consultas_externas is 'Histórico e telemetria de chamadas a fontes externas e serviços pagos (seções 16 e 18 do PRD).';
comment on column consultas_externas.duracao_ms is 'Tempo total de resposta da requisição em milissegundos.';

create index consultas_externas_conta_idx on consultas_externas (conta_id);
create index consultas_externas_fonte_idx on consultas_externas (conta_id, fonte, inicio desc);

-- ---------------------------------------------------------------------------
-- 2. Registro de Atividades (Audit Trail / RF-CFG-04)
-- ---------------------------------------------------------------------------
create table registro_atividade (
  id          uuid primary key default gen_random_uuid(),
  conta_id    uuid not null references contas (id),
  usuario_id  uuid references usuarios (id) on delete set null,
  acao        text not null, -- 'criar', 'editar', 'excluir', 'restaurar', 'visualizar'
  entidade    text not null, -- 'processo', 'pessoa', 'contrato', 'arquivo', 'permissao'
  entidade_id uuid,
  detalhes    jsonb not null default '{}'::jsonb,
  criado_em   timestamptz not null default now()
);

comment on table registro_atividade is 'Trilha de auditoria: quem fez o quê, em qual entidade e quando (RF-CFG-04).';
comment on column registro_atividade.detalhes is 'Detalhes da operação: diff antes/depois, metadados ou campos editados.';

create index registro_atividade_conta_idx on registro_atividade (conta_id);
create index registro_atividade_usuario_idx on registro_atividade (usuario_id);
create index registro_atividade_entidade_idx on registro_atividade (conta_id, entidade, entidade_id);
create index registro_atividade_data_idx on registro_atividade (conta_id, criado_em desc);

-- ---------------------------------------------------------------------------
-- 3. Registro de Acessos (Logins e Segurança / RF-CFG-05)
-- ---------------------------------------------------------------------------
create table registro_acesso (
  id          uuid primary key default gen_random_uuid(),
  conta_id    uuid references contas (id) on delete cascade,
  usuario_id  uuid references usuarios (id) on delete set null,
  email       text not null,
  data_hora   timestamptz not null default now(),
  ip          text,
  user_agent  text,
  resultado   text not null, -- 'sucesso', 'senha_incorreta', 'usuario_bloqueado', '2fa_pendente', '2fa_falhou'
  criado_em   timestamptz not null default now()
);

comment on table registro_acesso is 'Histórico de logins, sessões e tentativas de acesso (RF-CFG-05).';
comment on column registro_acesso.resultado is 'Status da tentativa de autenticação.';

create index registro_acesso_conta_idx on registro_acesso (conta_id) where conta_id is not null;
create index registro_acesso_usuario_idx on registro_acesso (usuario_id) where usuario_id is not null;
create index registro_acesso_data_idx on registro_acesso (data_hora desc);

-- ---------------------------------------------------------------------------
-- 4. Função de Expurgo Definitivo da Lixeira (Retenção de 30 dias / PRD 17.5)
-- Sem agendamento nesta fase (agendamento vem na Fase 5 com pg_cron).
-- ---------------------------------------------------------------------------
create or replace function expurgar_registros_excluidos()
returns table (tabela text, registros_excluidos bigint)
language plpgsql security definer set search_path = public as $$
declare
  v_processos_count bigint := 0;
  v_ged_count bigint := 0;
begin
  -- 1. Expurga arquivos do GED com mais de 30 dias na lixeira
  -- (as versões serão apagadas via cascade na FK de ged_versoes)
  delete from ged_arquivos
   where excluido_em is not null
     and excluido_em < now() - interval '30 days';
  get diagnostics v_ged_count = row_count;

  -- 2. Expurga pastas processuais com mais de 30 dias na lixeira
  -- (partes, andamentos, etc. são apagados via cascade)
  delete from processos
   where excluido_em is not null
     and excluido_em < now() - interval '30 days';
  get diagnostics v_processos_count = row_count;

  tabela := 'ged_arquivos';
  registros_excluidos := v_ged_count;
  return next;

  tabela := 'processos';
  registros_excluidos := v_processos_count;
  return next;
end $$;

comment on function expurgar_registros_excluidos() is
'Remove definitivamente do banco os registros cuja exclusão temporária (excluido_em) ocorreu há mais de 30 dias (lixeira do PRD 17.5).';

revoke all on function expurgar_registros_excluidos() from public;
grant execute on function expurgar_registros_excluidos() to service_role;

-- ---------------------------------------------------------------------------
-- 5. Row Level Security (RLS)
-- ---------------------------------------------------------------------------
alter table consultas_externas  enable row level security;
alter table registro_atividade  enable row level security;
alter table registro_acesso     enable row level security;

-- consultas_externas: visível para dono ou quem tem acesso a configurações
create policy consultas_externas_ver on consultas_externas for select to authenticated
  using (conta_id = conta_atual() and (pode('configuracoes', 'ver') or perfil_atual() = 'dono'));
create policy consultas_externas_criar on consultas_externas for insert to authenticated
  with check (conta_id = conta_atual());

-- registro_atividade: audit logs são append-only (sem update nem delete)
create policy registro_atividade_ver on registro_atividade for select to authenticated
  using (conta_id = conta_atual() and (pode('configuracoes', 'ver') or perfil_atual() = 'dono'));
create policy registro_atividade_criar on registro_atividade for insert to authenticated
  with check (conta_id = conta_atual());

-- registro_acesso: visível para dono ou o próprio usuário para seus logins
create policy registro_acesso_ver on registro_acesso for select to authenticated
  using (
    (conta_id = conta_atual() or usuario_id = auth.uid()) and
    (perfil_atual() = 'dono' or usuario_id = auth.uid())
  );
create policy registro_acesso_criar on registro_acesso for insert to authenticated
  with check (conta_id is null or conta_id = conta_atual());

-- Permissões de tabela para authenticated (apenas select e insert para logs)
grant select, insert on
  consultas_externas, registro_atividade, registro_acesso
to authenticated;
