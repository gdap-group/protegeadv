-- 0003_partes_andamentos_buscas_leituras.sql
-- Tabelas operacionais de processos: partes_processo, andamentos, pedidos_busca e leituras.
-- Segue PRD seções 4, 5, 7 e 18.
-- RLS com conta_atual(), pode() e pode_ver_processo().
-- Regra de integridade: valor oficial nunca sobrescrito por edição manual (colunas *_manual).

-- ---------------------------------------------------------------------------
-- Tipos (listas fechadas conforme PRD)
-- ---------------------------------------------------------------------------
create type parte_polo           as enum ('ativo', 'passivo', 'outro');
create type parte_origem         as enum ('fonte', 'manual');
create type andamento_origem     as enum ('automatico', 'manual');
create type pedido_busca_estado  as enum (
  'em_processamento', 'processada', 'monitorando',
  'nao_monitorada', 'erro', 'arquivada'
);
create type leitura_item_tipo    as enum ('andamento', 'publicacao');

-- ---------------------------------------------------------------------------
-- 1. Partes do Processo
-- ---------------------------------------------------------------------------
create table partes_processo (
  id             uuid primary key default gen_random_uuid(),
  conta_id       uuid not null references contas (id),
  processo_id    uuid not null references processos (id) on delete cascade,
  nome           text not null,
  nome_manual    text,
  polo           parte_polo not null,
  polo_manual    parte_polo,
  advogados      jsonb not null default '[]'::jsonb,
  pessoa_id      uuid, -- Vínculo opcional com a futura tabela pessoas (sem chave estrangeira por enquanto)
  origem         parte_origem not null default 'fonte',
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

comment on table partes_processo is 'Partes e advogados envolvidos no processo judicial.';
comment on column partes_processo.nome is 'Nome da parte vindo da fonte oficial. Nunca sobrescrito por edição manual.';
comment on column partes_processo.nome_manual is 'Nome corrigido manualmente; a tela mostra este se existir, sem apagar o oficial.';
comment on column partes_processo.polo is 'Polo processual vindo da fonte oficial (ativo, passivo, outro).';
comment on column partes_processo.polo_manual is 'Polo corrigido manualmente.';
comment on column partes_processo.pessoa_id is 'Vínculo opcional com a futura tabela pessoas.';

create index partes_processo_conta_idx on partes_processo (conta_id);
create index partes_processo_processo_idx on partes_processo (processo_id);
create index partes_processo_pessoa_idx on partes_processo (pessoa_id) where pessoa_id is not null;

create trigger t_partes_processo_atualizado
  before update on partes_processo
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 2. Andamentos
-- ---------------------------------------------------------------------------
create table andamentos (
  id             uuid primary key default gen_random_uuid(),
  conta_id       uuid not null references contas (id),
  processo_id    uuid not null references processos (id) on delete cascade,
  data_hora      timestamptz not null,
  codigo         text,
  descricao      text not null,
  grau           text,
  origem         andamento_origem not null default 'automatico',
  fonte          text, -- Ex: 'datajud'
  id_externo     text, -- Identificador único do movimento na fonte oficial
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

comment on table andamentos is 'Linha do tempo de movimentações processuais oficiais e lançamentos manuais.';
comment on column andamentos.id_externo is 'ID da movimentação na fonte oficial para evitar duplicidade de importação.';

create unique index andamentos_conta_fonte_externo_uk on andamentos (conta_id, fonte, id_externo)
  where id_externo is not null;
create index andamentos_conta_idx on andamentos (conta_id);
create index andamentos_processo_idx on andamentos (processo_id, data_hora desc);

create trigger t_andamentos_atualizado
  before update on andamentos
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 3. Pedidos de Busca (DataJud / Busca Automática)
-- ---------------------------------------------------------------------------
create table pedidos_busca (
  id             uuid primary key default gen_random_uuid(),
  conta_id       uuid not null references contas (id),
  processo_id    uuid references processos (id) on delete set null,
  numero_cnj     text not null check (numero_cnj ~ '^[0-9]{20}$'),
  estado         pedido_busca_estado not null default 'em_processamento',
  tentativas     integer not null default 0,
  erro           text,
  resultado      jsonb not null default '{}'::jsonb,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

comment on table pedidos_busca is 'Fila de consultas assíncronas ao DataJud por número de processo.';
comment on column pedidos_busca.estado is 'Estado da busca: em_processamento, processada, monitorando, nao_monitorada, erro, arquivada.';

create index pedidos_busca_conta_idx on pedidos_busca (conta_id);
create index pedidos_busca_conta_estado_idx on pedidos_busca (conta_id, estado);
create index pedidos_busca_processo_idx on pedidos_busca (processo_id) where processo_id is not null;

create trigger t_pedidos_busca_atualizado
  before update on pedidos_busca
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 4. Leituras (Registro de visualização por usuário)
-- ---------------------------------------------------------------------------
create table leituras (
  id             uuid primary key default gen_random_uuid(),
  conta_id       uuid not null references contas (id),
  item_tipo      leitura_item_tipo not null,
  item_id        uuid not null,
  usuario_id     uuid not null references usuarios (id) on delete cascade,
  lido_em        timestamptz not null default now(),
  unique (item_tipo, item_id, usuario_id)
);

comment on table leituras is 'Controle individual de itens lidos/não lidos por usuário (andamentos e publicações).';

create index leituras_conta_idx on leituras (conta_id);
create index leituras_usuario_idx on leituras (usuario_id);
create index leituras_item_idx on leituras (item_tipo, item_id);

-- ---------------------------------------------------------------------------
-- 5. Row Level Security (RLS)
-- ---------------------------------------------------------------------------
alter table partes_processo enable row level security;
alter table andamentos      enable row level security;
alter table pedidos_busca   enable row level security;
alter table leituras        enable row level security;

-- partes_processo: visibilidade respeita pode_ver_processo
create policy partes_processo_ver on partes_processo for select to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(processo_id));
create policy partes_processo_criar on partes_processo for insert to authenticated
  with check (conta_id = conta_atual() and pode_ver_processo(processo_id) and pode('processos', 'editar'));
create policy partes_processo_editar on partes_processo for update to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(processo_id) and pode('processos', 'editar'))
  with check (conta_id = conta_atual() and pode_ver_processo(processo_id) and pode('processos', 'editar'));
create policy partes_processo_excluir on partes_processo for delete to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(processo_id) and pode('processos', 'editar'));

-- andamentos: visibilidade respeita pode_ver_processo
create policy andamentos_ver on andamentos for select to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(processo_id));
create policy andamentos_criar on andamentos for insert to authenticated
  with check (conta_id = conta_atual() and pode_ver_processo(processo_id) and pode('processos', 'editar'));
create policy andamentos_editar on andamentos for update to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(processo_id) and pode('processos', 'editar'))
  with check (conta_id = conta_atual() and pode_ver_processo(processo_id) and pode('processos', 'editar'));
create policy andamentos_excluir on andamentos for delete to authenticated
  using (conta_id = conta_atual() and pode_ver_processo(processo_id) and pode('processos', 'excluir'));

-- pedidos_busca: módulo 'processos'
create policy pedidos_busca_ver on pedidos_busca for select to authenticated
  using (conta_id = conta_atual() and pode('processos', 'ver'));
create policy pedidos_busca_criar on pedidos_busca for insert to authenticated
  with check (conta_id = conta_atual() and pode('processos', 'criar'));
create policy pedidos_busca_editar on pedidos_busca for update to authenticated
  using (conta_id = conta_atual() and pode('processos', 'editar'))
  with check (conta_id = conta_atual() and pode('processos', 'editar'));
create policy pedidos_busca_excluir on pedidos_busca for delete to authenticated
  using (conta_id = conta_atual() and pode('processos', 'excluir'));

-- leituras: cada usuário lê e gerencia suas próprias marcações de leitura
create policy leituras_ver on leituras for select to authenticated
  using (conta_id = conta_atual());
create policy leituras_criar on leituras for insert to authenticated
  with check (conta_id = conta_atual() and usuario_id = auth.uid());
create policy leituras_editar on leituras for update to authenticated
  using (conta_id = conta_atual() and usuario_id = auth.uid())
  with check (conta_id = conta_atual() and usuario_id = auth.uid());
create policy leituras_excluir on leituras for delete to authenticated
  using (conta_id = conta_atual() and usuario_id = auth.uid());

-- Permissões de tabela para authenticated (RLS filtra as linhas)
grant select, insert, update, delete on
  partes_processo, andamentos, pedidos_busca, leituras
to authenticated;
