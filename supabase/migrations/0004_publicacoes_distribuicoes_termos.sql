-- 0004_publicacoes_distribuicoes_termos.sql
-- Módulo de Publicações (DJEN) e Distribuições Eletrônicas.
-- Contém: termos_vigiados, termo_vigiado_destinatarios, publicacoes,
-- publicacao_termos e distribuicoes.
-- Segue PRD seções 6, 7 e 18.
-- RLS com conta_atual(), pode() e pode_ver_processo().

-- ---------------------------------------------------------------------------
-- Tipos (listas fechadas conforme PRD)
-- ---------------------------------------------------------------------------
create type termo_tipo           as enum ('nome', 'advogado', 'oab', 'cnpj');
create type publicacao_situacao  as enum ('nova', 'lida', 'arquivada');
create type publicacao_vinculo   as enum ('automatico', 'manual', 'nenhum');
create type distribuicao_situacao as enum ('caixa', 'arquivada', 'ignorada', 'aceita');

-- ---------------------------------------------------------------------------
-- 1. Termos Vigiados (Monitoramentos DJEN / Distribuições)
-- ---------------------------------------------------------------------------
create table termos_vigiados (
  id                 uuid primary key default gen_random_uuid(),
  conta_id           uuid not null references contas (id),
  tipo               termo_tipo not null,
  valor              text not null,
  variacoes          text[] not null default '{}'::text[],
  palavras_ignorar   text[] not null default '{}'::text[],
  ativo              boolean not null default true,
  ultima_consulta_em timestamptz,
  usuario_id         uuid references usuarios (id) on delete set null, -- Quem criou o termo
  criado_em          timestamptz not null default now(),
  atualizado_em      timestamptz not null default now(),
  unique (conta_id, tipo, valor)
);

comment on table termos_vigiados is 'Termos monitorados no DJEN para captura de publicações e distribuições (nome, advogado, OAB, CNPJ).';
comment on column termos_vigiados.variacoes is 'Variações de grafia, razão social ou siglas monitoradas junto com o termo.';
comment on column termos_vigiados.palavras_ignorar is 'Palavras para filtrar e descartar homônimos automaticamente.';

create index termos_vigiados_conta_idx on termos_vigiados (conta_id);
create index termos_vigiados_conta_ativo_idx on termos_vigiados (conta_id, tipo) where ativo;

create trigger t_termos_vigiados_atualizado
  before update on termos_vigiados
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 2. Destinatários de Avisos por Termo Vigiado
-- ---------------------------------------------------------------------------
create table termo_vigiado_destinatarios (
  id               uuid primary key default gen_random_uuid(),
  conta_id         uuid not null references contas (id),
  termo_vigiado_id uuid not null references termos_vigiados (id) on delete cascade,
  usuario_id       uuid not null references usuarios (id) on delete cascade,
  criado_em        timestamptz not null default now(),
  unique (termo_vigiado_id, usuario_id)
);

comment on table termo_vigiado_destinatarios is 'Usuários que recebem avisos imediatos quando novidades são encontradas para o termo.';

create index termo_vigiado_destinatarios_conta_idx on termo_vigiado_destinatarios (conta_id);
create index termo_vigiado_destinatarios_usuario_idx on termo_vigiado_destinatarios (usuario_id);

-- ---------------------------------------------------------------------------
-- 3. Publicações (Diário de Justiça Eletrônico Nacional - DJEN)
-- ---------------------------------------------------------------------------
create table publicacoes (
  id                    uuid primary key default gen_random_uuid(),
  conta_id              uuid not null references contas (id),
  id_comunicacao        text not null, -- Identificador único da comunicação no DJEN
  tribunal              text,
  orgao                 text,
  data_disponibilizacao date not null,
  tipo                  text,
  teor                  text not null,
  numero_cnj_citado     text,
  situacao              publicacao_situacao not null default 'nova',
  tipo_vinculo          publicacao_vinculo not null default 'nenhum',
  processo_id           uuid references processos (id) on delete set null,
  criado_em             timestamptz not null default now(),
  atualizado_em         timestamptz not null default now(),
  unique (conta_id, id_comunicacao)
);

comment on table publicacoes is 'Publicações oficiais capturadas no DJEN ligadas aos processos da conta.';
comment on column publicacoes.id_comunicacao is 'Identificador oficial no DJEN para garantia de unicidade e não duplicidade.';
comment on column publicacoes.tipo_vinculo is 'Forma de vínculo: automatico (pelo CNJ), manual (pelo usuário) ou nenhum (não vinculada).';

-- Índices otimizados para a Caixa de Entrada de Publicações solicitados no PRD
create index publicacoes_caixa_idx on publicacoes (conta_id, situacao, data_disponibilizacao desc);
create index publicacoes_cnj_idx on publicacoes (conta_id, numero_cnj_citado);
create index publicacoes_processo_idx on publicacoes (processo_id) where processo_id is not null;

create trigger t_publicacoes_atualizado
  before update on publicacoes
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 4. Associação de Publicações aos Termos Vigiados
-- Uma publicação pode ser encontrada por múltiplos termos (ex: OAB e Nome)
-- ---------------------------------------------------------------------------
create table publicacao_termos (
  id               uuid primary key default gen_random_uuid(),
  conta_id         uuid not null references contas (id),
  publicacao_id    uuid not null references publicacoes (id) on delete cascade,
  termo_vigiado_id uuid not null references termos_vigiados (id) on delete cascade,
  criado_em        timestamptz not null default now(),
  unique (publicacao_id, termo_vigiado_id)
);

comment on table publicacao_termos is 'Relacionamento N:N indicando quais termos vigiados capturaram a publicação.';

create index publicacao_termos_conta_idx on publicacao_termos (conta_id);
create index publicacao_termos_termo_idx on publicacao_termos (termo_vigiado_id);

-- ---------------------------------------------------------------------------
-- 5. Distribuições Eletrônicas (Processos Novos Descobertos)
-- ---------------------------------------------------------------------------
create table distribuicoes (
  id               uuid primary key default gen_random_uuid(),
  conta_id         uuid not null references contas (id),
  numero_cnj       text not null check (numero_cnj ~ '^[0-9]{20}$'),
  tribunal         text,
  data             date,
  termo_vigiado_id uuid references termos_vigiados (id) on delete set null,
  situacao         distribuicao_situacao not null default 'caixa',
  processo_id      uuid references processos (id) on delete set null,
  criado_em        timestamptz not null default now(),
  atualizado_em    timestamptz not null default now(),
  unique (conta_id, numero_cnj)
);

comment on table distribuicoes is 'Caixa de triagem de processos novos descobertos por nome ou OAB antes de virarem pasta.';
comment on column distribuicoes.situacao is 'Situação na esteira de triagem: caixa, arquivada, ignorada ou aceita.';

create index distribuicoes_conta_idx on distribuicoes (conta_id);
create index distribuicoes_caixa_idx on distribuicoes (conta_id, situacao, data desc);
create index distribuicoes_processo_idx on distribuicoes (processo_id) where processo_id is not null;

create trigger t_distribuicoes_atualizado
  before update on distribuicoes
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 6. Row Level Security (RLS)
-- ---------------------------------------------------------------------------
alter table termos_vigiados              enable row level security;
alter table termo_vigiado_destinatarios  enable row level security;
alter table publicacoes                  enable row level security;
alter table publicacao_termos            enable row level security;
alter table distribuicoes                enable row level security;

-- termos_vigiados: módulos 'publicacoes' ou 'processos'
create policy termos_vigiados_ver on termos_vigiados for select to authenticated
  using (conta_id = conta_atual() and (pode('publicacoes', 'ver') or pode('processos', 'ver')));
create policy termos_vigiados_criar on termos_vigiados for insert to authenticated
  with check (conta_id = conta_atual() and (pode('publicacoes', 'criar') or pode('processos', 'criar')));
create policy termos_vigiados_editar on termos_vigiados for update to authenticated
  using (conta_id = conta_atual() and (pode('publicacoes', 'editar') or pode('processos', 'editar')))
  with check (conta_id = conta_atual() and (pode('publicacoes', 'editar') or pode('processos', 'editar')));
create policy termos_vigiados_excluir on termos_vigiados for delete to authenticated
  using (conta_id = conta_atual() and (pode('publicacoes', 'excluir') or pode('processos', 'excluir')));

-- termo_vigiado_destinatarios
create policy termo_vigiado_destinatarios_ver on termo_vigiado_destinatarios for select to authenticated
  using (conta_id = conta_atual() and (pode('publicacoes', 'ver') or pode('processos', 'ver')));
create policy termo_vigiado_destinatarios_criar on termo_vigiado_destinatarios for insert to authenticated
  with check (conta_id = conta_atual() and (pode('publicacoes', 'editar') or pode('processos', 'editar')));
create policy termo_vigiado_destinatarios_excluir on termo_vigiado_destinatarios for delete to authenticated
  using (conta_id = conta_atual() and (pode('publicacoes', 'editar') or pode('processos', 'editar')));

-- publicacoes: leitura respeita pode_ver_processo caso a publicação já esteja vinculada
create policy publicacoes_ver on publicacoes for select to authenticated
  using (
    conta_id = conta_atual() and pode('publicacoes', 'ver') and (
      processo_id is null or pode_ver_processo(processo_id)
    )
  );
create policy publicacoes_criar on publicacoes for insert to authenticated
  with check (conta_id = conta_atual() and pode('publicacoes', 'criar'));
create policy publicacoes_editar on publicacoes for update to authenticated
  using (conta_id = conta_atual() and pode('publicacoes', 'editar'))
  with check (conta_id = conta_atual() and pode('publicacoes', 'editar'));
create policy publicacoes_excluir on publicacoes for delete to authenticated
  using (conta_id = conta_atual() and pode('publicacoes', 'excluir'));

-- publicacao_termos
create policy publicacao_termos_ver on publicacao_termos for select to authenticated
  using (conta_id = conta_atual() and pode('publicacoes', 'ver'));
create policy publicacao_termos_criar on publicacao_termos for insert to authenticated
  with check (conta_id = conta_atual() and pode('publicacoes', 'criar'));
create policy publicacao_termos_excluir on publicacao_termos for delete to authenticated
  using (conta_id = conta_atual() and pode('publicacoes', 'excluir'));

-- distribuicoes: leitura respeita pode_ver_processo caso já vinculada
create policy distribuicoes_ver on distribuicoes for select to authenticated
  using (
    conta_id = conta_atual() and pode('processos', 'ver') and (
      processo_id is null or pode_ver_processo(processo_id)
    )
  );
create policy distribuicoes_criar on distribuicoes for insert to authenticated
  with check (conta_id = conta_atual() and pode('processos', 'criar'));
create policy distribuicoes_editar on distribuicoes for update to authenticated
  using (conta_id = conta_atual() and pode('processos', 'editar'))
  with check (conta_id = conta_atual() and pode('processos', 'editar'));
create policy distribuicoes_excluir on distribuicoes for delete to authenticated
  using (conta_id = conta_atual() and pode('processos', 'excluir'));

-- Permissões de tabela para authenticated (RLS filtra as linhas)
grant select, insert, update, delete on
  termos_vigiados, termo_vigiado_destinatarios,
  publicacoes, publicacao_termos, distribuicoes
to authenticated;
