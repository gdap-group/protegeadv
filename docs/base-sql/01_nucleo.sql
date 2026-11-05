-- 01_nucleo.sql
-- Núcleo mínimo do banco do Protege ADV / Protege Empresa.
-- Contém: tipos, contas, usuários, grupos e permissões, etiquetas, processos,
-- responsáveis de processo, funções de segurança e políticas RLS.
-- As demais tabelas do núcleo (partes, andamentos, pedidos de busca, leituras,
-- consultas externas, histórico) ficam fora deste script de referência.

create extension if not exists pgcrypto;  -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Tipos (listas fechadas, valores exatos do PRD)
-- ---------------------------------------------------------------------------
create type conta_tipo           as enum ('escritorio', 'empresa');
create type conta_situacao       as enum ('ativa', 'suspensa', 'cancelada');
create type perfil_usuario       as enum ('dono', 'advogado', 'estagiario', 'leitura');
create type modulo_sistema       as enum (
  'processos', 'publicacoes', 'agenda', 'pessoas', 'ged',
  'contratos', 'usuarios', 'configuracoes', 'empresa'
);
create type processo_status      as enum ('indefinido', 'ativo', 'suspenso', 'baixado', 'encerrado', 'arquivado');
create type monitoramento_estado as enum ('em_dia', 'aguardando_atualizacao', 'nao_monitorado');
create type papel_processo       as enum ('responsavel', 'envolvido');

-- Mantém atualizado_em sempre correto.
create or replace function definir_atualizado_em() returns trigger
language plpgsql as $$
begin
  new.atualizado_em := now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Contas e acesso
-- ---------------------------------------------------------------------------
create table contas (
  id             uuid primary key default gen_random_uuid(),
  tipo           conta_tipo not null,
  nome           text not null,
  cnpj           text,
  fuso           text not null default 'America/Sao_Paulo',
  modulos_ativos jsonb not null default '{}'::jsonb,
  limites        jsonb not null default '{}'::jsonb,
  situacao       conta_situacao not null default 'ativa',
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);
comment on table contas is 'Cada escritório ou empresa cliente do sistema. Raiz do isolamento de dados.';
comment on column contas.limites is 'Limites da conta: usuários, processos monitorados, armazenamento, consultas pagas por mês.';

create table usuarios (
  id                       uuid primary key references auth.users (id) on delete cascade,
  conta_id                 uuid not null references contas (id),
  nome                     text not null,
  email                    text not null,
  whatsapp                 text,
  whatsapp_confirmado      boolean not null default false,
  oab_numero               text,
  oab_uf                   char(2),
  verificacao_dois_passos  boolean not null default false,
  ativo                    boolean not null default true,
  perfil                   perfil_usuario not null default 'advogado',
  restringir_a_responsavel boolean not null default false,
  criado_em                timestamptz not null default now(),
  atualizado_em            timestamptz not null default now()
);
comment on table usuarios is 'Usuário do sistema. Pertence a UMA conta. O id é o mesmo da autenticação.';
comment on column usuarios.restringir_a_responsavel is 'Quando verdadeiro, o usuário só vê processos em que é responsável ou envolvido.';
create unique index usuarios_conta_email_uk on usuarios (conta_id, lower(email));
create index usuarios_conta_idx on usuarios (conta_id);

create table grupos (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas (id),
  nome          text not null,
  descricao     text,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (conta_id, nome)
);
comment on table grupos is 'Grupos de permissão da conta.';
create index grupos_conta_idx on grupos (conta_id);

create table grupo_permissoes (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas (id),
  grupo_id      uuid not null references grupos (id) on delete cascade,
  modulo        modulo_sistema not null,
  pode_ver      boolean not null default false,
  pode_criar    boolean not null default false,
  pode_editar   boolean not null default false,
  pode_excluir  boolean not null default false,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (grupo_id, modulo)
);
comment on table grupo_permissoes is 'Ações permitidas por grupo e módulo.';
create index grupo_permissoes_conta_idx on grupo_permissoes (conta_id);

create table usuario_grupos (
  conta_id   uuid not null references contas (id),
  usuario_id uuid not null references usuarios (id) on delete cascade,
  grupo_id   uuid not null references grupos (id) on delete cascade,
  criado_em  timestamptz not null default now(),
  primary key (usuario_id, grupo_id)
);
create index usuario_grupos_conta_idx on usuario_grupos (conta_id);

create table etiquetas (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas (id),
  nome          text not null,
  cor           text not null default '#8B5CF6',
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (conta_id, nome)
);
comment on table etiquetas is 'Etiquetas livres com cor, usadas em processos, pessoas e contratos.';
create index etiquetas_conta_idx on etiquetas (conta_id);

-- ---------------------------------------------------------------------------
-- Processos
-- ---------------------------------------------------------------------------
create table processos (
  id                          uuid primary key default gen_random_uuid(),
  conta_id                    uuid not null references contas (id),
  numero_cnj                  text not null check (numero_cnj ~ '^[0-9]{20}$'),
  tribunal                    text,
  grau                        text,
  orgao                       text,
  orgao_manual                text,
  classe                      text,
  classe_manual               text,
  assuntos                    jsonb not null default '[]'::jsonb,
  data_ajuizamento            date,
  data_ajuizamento_manual     date,
  sigilo                      integer,
  status                      processo_status not null default 'indefinido',
  probabilidade               text,
  valor_causa                 numeric(14,2),
  estado_monitoramento        monitoramento_estado not null default 'nao_monitorado',
  nao_encontrado_na_base      boolean not null default false,
  ultima_atualizacao_fonte    timestamptz,
  ultimo_andamento_em         timestamptz,
  observacoes                 text,
  excluido_em                 timestamptz,
  criado_em                   timestamptz not null default now(),
  atualizado_em               timestamptz not null default now()
);
comment on table processos is 'Pasta processual. Número CNJ único por conta entre os não excluídos.';
comment on column processos.classe is 'Valor vindo da fonte oficial. Nunca sobrescrito por edição manual.';
comment on column processos.classe_manual is 'Valor corrigido à mão; a tela mostra este se existir, sem apagar o oficial.';
create unique index processos_conta_numero_uk on processos (conta_id, numero_cnj) where excluido_em is null;
create index processos_conta_idx on processos (conta_id);
create index processos_conta_estado_idx on processos (conta_id, estado_monitoramento) where excluido_em is null;
create index processos_conta_ultimo_andamento_idx on processos (conta_id, ultimo_andamento_em desc);

create table responsaveis_processo (
  id          uuid primary key default gen_random_uuid(),
  conta_id    uuid not null references contas (id),
  processo_id uuid not null references processos (id) on delete cascade,
  usuario_id  uuid not null references usuarios (id) on delete cascade,
  papel       papel_processo not null default 'responsavel',
  criado_em   timestamptz not null default now(),
  unique (processo_id, usuario_id)
);
create index responsaveis_processo_conta_idx on responsaveis_processo (conta_id);
create index responsaveis_processo_usuario_idx on responsaveis_processo (usuario_id);

-- Triggers de atualizado_em
create trigger t_contas_atualizado           before update on contas           for each row execute function definir_atualizado_em();
create trigger t_usuarios_atualizado         before update on usuarios         for each row execute function definir_atualizado_em();
create trigger t_grupos_atualizado           before update on grupos           for each row execute function definir_atualizado_em();
create trigger t_grupo_permissoes_atualizado before update on grupo_permissoes for each row execute function definir_atualizado_em();
create trigger t_etiquetas_atualizado        before update on etiquetas        for each row execute function definir_atualizado_em();
create trigger t_processos_atualizado        before update on processos        for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- Funções de segurança (a conta SEMPRE vem do login, nunca da tela)
-- security definer + search_path fixo: evitam recursão de RLS e injeção de caminho.
-- ---------------------------------------------------------------------------
create or replace function conta_atual() returns uuid
language sql stable security definer set search_path = public as $$
  select u.conta_id from usuarios u where u.id = auth.uid() and u.ativo
$$;

create or replace function perfil_atual() returns perfil_usuario
language sql stable security definer set search_path = public as $$
  select u.perfil from usuarios u where u.id = auth.uid() and u.ativo
$$;

-- pode('processos', 'ver'): dono pode tudo; perfil leitura só vê; demais pelos grupos.
create or replace function pode(p_modulo modulo_sistema, p_acao text) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare
  v_perfil perfil_usuario;
  v_ok boolean;
begin
  if p_acao not in ('ver', 'criar', 'editar', 'excluir') then
    raise exception 'ação inválida: %', p_acao;
  end if;
  v_perfil := perfil_atual();
  if v_perfil is null then
    return false;
  end if;
  if v_perfil = 'dono' then
    return true;
  end if;
  if v_perfil = 'leitura' and p_acao <> 'ver' then
    return false;
  end if;
  select bool_or(case p_acao
           when 'ver'     then gp.pode_ver
           when 'criar'   then gp.pode_criar
           when 'editar'  then gp.pode_editar
           when 'excluir' then gp.pode_excluir
         end)
    into v_ok
    from usuario_grupos ug
    join grupo_permissoes gp on gp.grupo_id = ug.grupo_id and gp.conta_id = ug.conta_id
   where ug.usuario_id = auth.uid()
     and gp.modulo = p_modulo;
  return coalesce(v_ok, false);
end $$;

-- Usuário restrito só vê processos em que é responsável ou envolvido.
create or replace function pode_ver_processo(p_processo_id uuid) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare
  v_restrito boolean;
begin
  if not pode('processos', 'ver') then
    return false;
  end if;
  select u.restringir_a_responsavel into v_restrito
    from usuarios u where u.id = auth.uid() and u.ativo;
  if coalesce(v_restrito, false) = false or perfil_atual() = 'dono' then
    return exists (select 1 from processos p
                    where p.id = p_processo_id and p.conta_id = conta_atual());
  end if;
  return exists (select 1 from responsaveis_processo r
                  where r.processo_id = p_processo_id
                    and r.usuario_id = auth.uid()
                    and r.conta_id = conta_atual());
end $$;

revoke all on function conta_atual(), perfil_atual(), pode(modulo_sistema, text), pode_ver_processo(uuid) from public;
grant execute on function conta_atual(), perfil_atual(), pode(modulo_sistema, text), pode_ver_processo(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table contas                enable row level security;
alter table usuarios              enable row level security;
alter table grupos                enable row level security;
alter table grupo_permissoes      enable row level security;
alter table usuario_grupos        enable row level security;
alter table etiquetas             enable row level security;
alter table processos             enable row level security;
alter table responsaveis_processo enable row level security;

-- contas: cada usuário vê só a própria conta; alteração só pelo dono.
create policy contas_ver on contas for select to authenticated
  using (id = conta_atual());
create policy contas_editar on contas for update to authenticated
  using (id = conta_atual() and perfil_atual() = 'dono')
  with check (id = conta_atual() and perfil_atual() = 'dono');

-- usuarios
create policy usuarios_ver on usuarios for select to authenticated
  using (conta_id = conta_atual());
create policy usuarios_criar on usuarios for insert to authenticated
  with check (conta_id = conta_atual() and pode('usuarios', 'criar'));
create policy usuarios_editar on usuarios for update to authenticated
  using (conta_id = conta_atual() and pode('usuarios', 'editar'))
  with check (conta_id = conta_atual() and pode('usuarios', 'editar'));
create policy usuarios_excluir on usuarios for delete to authenticated
  using (conta_id = conta_atual() and pode('usuarios', 'excluir'));

-- grupos, permissões e vínculos: módulo 'usuarios'
create policy grupos_ver on grupos for select to authenticated
  using (conta_id = conta_atual());
create policy grupos_criar on grupos for insert to authenticated
  with check (conta_id = conta_atual() and pode('usuarios', 'criar'));
create policy grupos_editar on grupos for update to authenticated
  using (conta_id = conta_atual() and pode('usuarios', 'editar'))
  with check (conta_id = conta_atual() and pode('usuarios', 'editar'));
create policy grupos_excluir on grupos for delete to authenticated
  using (conta_id = conta_atual() and pode('usuarios', 'excluir'));

create policy grupo_permissoes_ver on grupo_permissoes for select to authenticated
  using (conta_id = conta_atual());
create policy grupo_permissoes_criar on grupo_permissoes for insert to authenticated
  with check (conta_id = conta_atual() and pode('usuarios', 'criar'));
create policy grupo_permissoes_editar on grupo_permissoes for update to authenticated
  using (conta_id = conta_atual() and pode('usuarios', 'editar'))
  with check (conta_id = conta_atual() and pode('usuarios', 'editar'));
create policy grupo_permissoes_excluir on grupo_permissoes for delete to authenticated
  using (conta_id = conta_atual() and pode('usuarios', 'excluir'));

create policy usuario_grupos_ver on usuario_grupos for select to authenticated
  using (conta_id = conta_atual());
create policy usuario_grupos_criar on usuario_grupos for insert to authenticated
  with check (conta_id = conta_atual() and pode('usuarios', 'criar'));
create policy usuario_grupos_excluir on usuario_grupos for delete to authenticated
  using (conta_id = conta_atual() and pode('usuarios', 'excluir'));

-- etiquetas: qualquer usuário que possa criar/editar em processos gerencia etiquetas
create policy etiquetas_ver on etiquetas for select to authenticated
  using (conta_id = conta_atual());
create policy etiquetas_criar on etiquetas for insert to authenticated
  with check (conta_id = conta_atual() and pode('processos', 'criar'));
create policy etiquetas_editar on etiquetas for update to authenticated
  using (conta_id = conta_atual() and pode('processos', 'editar'))
  with check (conta_id = conta_atual() and pode('processos', 'editar'));
create policy etiquetas_excluir on etiquetas for delete to authenticated
  using (conta_id = conta_atual() and pode('processos', 'excluir'));

-- processos: leitura respeita a restrição por responsável
create policy processos_ver on processos for select to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(id));
create policy processos_criar on processos for insert to authenticated
  with check (conta_id = conta_atual() and pode('processos', 'criar'));
create policy processos_editar on processos for update to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(id) and pode('processos', 'editar'))
  with check (conta_id = conta_atual() and pode('processos', 'editar'));
create policy processos_excluir on processos for delete to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(id) and pode('processos', 'excluir'));

create policy responsaveis_processo_ver on responsaveis_processo for select to authenticated
  using (conta_id = conta_atual());
create policy responsaveis_processo_criar on responsaveis_processo for insert to authenticated
  with check (conta_id = conta_atual() and pode('processos', 'editar'));
create policy responsaveis_processo_excluir on responsaveis_processo for delete to authenticated
  using (conta_id = conta_atual() and pode('processos', 'editar'));

-- Permissões de tabela para o papel logado (a RLS filtra as linhas).
grant select, insert, update, delete on
  contas, usuarios, grupos, grupo_permissoes, usuario_grupos,
  etiquetas, processos, responsaveis_processo
to authenticated;
