-- 0005_ged_modelos_avisos.sql
-- Módulo GED (Gestão Eletrônica de Documentos) e Notificações/Avisos.
-- Contém: ged_pastas, ged_arquivos, ged_versoes, modelos_documento,
-- avisos e preferencias_aviso.
-- Segue PRD seções 11, 14 e 18.
-- Arquivos físicos ficam no Supabase Storage; tabelas guardam caminhos e metadados.
-- RLS com conta_atual(), pode(), perfil_atual() e pode_ver_processo().

-- ---------------------------------------------------------------------------
-- Tipos (listas fechadas conforme PRD)
-- ---------------------------------------------------------------------------
create type modelo_proprietario as enum ('sistema', 'conta');
create type aviso_canal        as enum ('email', 'whatsapp', 'sistema');
create type aviso_estado       as enum ('enviado', 'entregue', 'lido', 'falhou');

-- ---------------------------------------------------------------------------
-- 1. GED Pastas (Árvore de Pastas e Pastas de Itens)
-- ---------------------------------------------------------------------------
create table ged_pastas (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas (id),
  nome          text not null,
  pasta_pai_id  uuid references ged_pastas (id) on delete cascade,
  processo_id   uuid references processos (id) on delete cascade,
  item_tipo     text, -- 'processo', 'geral', 'pessoa', 'contrato'
  item_id       uuid, -- ID do item vinculado (sem FK por enquanto)
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (conta_id, pasta_pai_id, nome)
);

comment on table ged_pastas is 'Árvore de pastas do GED e pastas automáticas criadas para processos e outras entidades.';
comment on column ged_pastas.pasta_pai_id is 'Pasta pai para organização em hierarquia; nulo para raiz.';
comment on column ged_pastas.processo_id is 'Vínculo direto com o processo para pastas criadas na aba Documentos.';

create index ged_pastas_conta_idx on ged_pastas (conta_id);
create index ged_pastas_pai_idx on ged_pastas (pasta_pai_id);
create index ged_pastas_processo_idx on ged_pastas (processo_id) where processo_id is not null;

create trigger t_ged_pastas_atualizado
  before update on ged_pastas
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 2. GED Arquivos (Metadados dos Arquivos no Supabase Storage)
-- ---------------------------------------------------------------------------
create table ged_arquivos (
  id              uuid primary key default gen_random_uuid(),
  conta_id        uuid not null references contas (id),
  pasta_id        uuid references ged_pastas (id) on delete set null,
  processo_id     uuid references processos (id) on delete cascade,
  nome            text not null,
  caminho_storage text not null, -- Caminho do objeto no bucket do Supabase Storage
  tamanho_bytes   bigint not null default 0,
  tipo_mime       text not null default 'application/octet-stream',
  enviado_por     uuid references usuarios (id) on delete set null,
  versao_atual    integer not null default 1,
  excluido_em     timestamptz, -- Soft delete por 30 dias (lixeira)
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now()
);

comment on table ged_arquivos is 'Metadados de arquivos armazenados no Supabase Storage.';
comment on column ged_arquivos.caminho_storage is 'Chave de referência do arquivo físico no Supabase Storage.';
comment on column ged_arquivos.versao_atual is 'Número da versão vigente do arquivo.';

create index ged_arquivos_conta_idx on ged_arquivos (conta_id);
create index ged_arquivos_pasta_idx on ged_arquivos (pasta_id);
create index ged_arquivos_processo_idx on ged_arquivos (processo_id) where processo_id is not null;
create index ged_arquivos_enviado_por_idx on ged_arquivos (enviado_por);

create trigger t_ged_arquivos_atualizado
  before update on ged_arquivos
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 3. GED Versões (Histórico de Versões de Arquivos)
-- ---------------------------------------------------------------------------
create table ged_versoes (
  id              uuid primary key default gen_random_uuid(),
  conta_id        uuid not null references contas (id),
  arquivo_id      uuid not null references ged_arquivos (id) on delete cascade,
  versao          integer not null,
  caminho_storage text not null,
  tamanho_bytes   bigint not null,
  enviado_por     uuid references usuarios (id) on delete set null,
  criado_em       timestamptz not null default now(),
  unique (arquivo_id, versao)
);

comment on table ged_versoes is 'Histórico de versões anteriores de arquivos para auditoria e restauração.';

create index ged_versoes_conta_idx on ged_versoes (conta_id);
create index ged_versoes_arquivo_idx on ged_versoes (arquivo_id);

-- ---------------------------------------------------------------------------
-- 4. Modelos de Documento
-- ---------------------------------------------------------------------------
create table modelos_documento (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid references contas (id) on delete cascade, -- Nulo para modelos nativos do sistema
  nome          text not null,
  tipo          text not null, -- 'contrato_honorarios', 'procuracao', 'declaracao_hipossuficiencia', 'outro'
  modulo        modulo_sistema not null default 'ged',
  proprietario  modelo_proprietario not null default 'conta',
  conteudo      text not null, -- Texto estruturado/HTML com tags variáveis
  variaveis     jsonb not null default '[]'::jsonb,
  ativo         boolean not null default true,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table modelos_documento is 'Modelos de documentos automatizados com substituição de variáveis (procurações, contratos, etc).';
comment on column modelos_documento.proprietario is 'Indica se o modelo é nativo do sistema (sugestão) ou customizado pela conta.';

create index modelos_documento_conta_idx on modelos_documento (conta_id);
create index modelos_documento_tipo_idx on modelos_documento (tipo);

create trigger t_modelos_documento_atualizado
  before update on modelos_documento
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 5. Avisos (Histórico de Envios e Notificações)
-- ---------------------------------------------------------------------------
create table avisos (
  id               uuid primary key default gen_random_uuid(),
  conta_id         uuid not null references contas (id),
  usuario_id       uuid not null references usuarios (id) on delete cascade,
  evento           text not null, -- 'andamento_novo', 'publicacao_nova', 'distribuicao_nova', 'prazo_chegando', etc.
  canal            aviso_canal not null,
  estado           aviso_estado not null default 'enviado',
  titulo           text,
  mensagem         text,
  referencia_tipo  text, -- 'processo', 'publicacao', 'andamento', 'distribuicao'
  referencia_id    uuid, -- Sem chave estrangeira conforme especificação
  erro             text,
  enviado_em       timestamptz not null default now(),
  entregue_em      timestamptz,
  lido_em          timestamptz,
  criado_em        timestamptz not null default now()
);

comment on table avisos is 'Registro de notificações enviadas via WhatsApp, e-mail ou sino interno do sistema.';
comment on column avisos.referencia_tipo is 'Tipo do item que disparou o aviso.';
comment on column avisos.referencia_id is 'UUID do item de origem (processo, publicação, etc.) sem chave estrangeira rígida.';

create index avisos_conta_idx on avisos (conta_id);
create index avisos_usuario_idx on avisos (usuario_id, estado, enviado_em desc);
create index avisos_referencia_idx on avisos (referencia_tipo, referencia_id);

-- ---------------------------------------------------------------------------
-- 6. Preferências de Aviso por Usuário
-- ---------------------------------------------------------------------------
create table preferencias_aviso (
  id              uuid primary key default gen_random_uuid(),
  conta_id        uuid not null references contas (id),
  usuario_id      uuid not null references usuarios (id) on delete cascade,
  evento          text not null,
  canais          aviso_canal[] not null default '{sistema}'::aviso_canal[],
  silencio_inicio time,
  silencio_fim    time,
  criado_em       timestamptz not null default now(),
  atualizado_em   timestamptz not null default now(),
  unique (usuario_id, evento)
);

comment on table preferencias_aviso is 'Canais escolhidos por usuário para cada tipo de evento e configuração de horário de silêncio.';

create index preferencias_aviso_conta_idx on preferencias_aviso (conta_id);
create index preferencias_aviso_usuario_idx on preferencias_aviso (usuario_id);

create trigger t_preferencias_aviso_atualizado
  before update on preferencias_aviso
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 7. Row Level Security (RLS)
-- ---------------------------------------------------------------------------
alter table ged_pastas         enable row level security;
alter table ged_arquivos       enable row level security;
alter table ged_versoes        enable row level security;
alter table modelos_documento  enable row level security;
alter table avisos             enable row level security;
alter table preferencias_aviso enable row level security;

-- ged_pastas: visibilidade respeita pode_ver_processo caso associada a processo
create policy ged_pastas_ver on ged_pastas for select to authenticated
  using (
    conta_id = conta_atual() and pode('ged', 'ver') and (
      processo_id is null or pode_ver_processo(processo_id)
    )
  );
create policy ged_pastas_criar on ged_pastas for insert to authenticated
  with check (conta_id = conta_atual() and pode('ged', 'criar'));
create policy ged_pastas_editar on ged_pastas for update to authenticated
  using (conta_id = conta_atual() and pode('ged', 'editar'))
  with check (conta_id = conta_atual() and pode('ged', 'editar'));
create policy ged_pastas_excluir on ged_pastas for delete to authenticated
  using (conta_id = conta_atual() and pode('ged', 'excluir'));

-- ged_arquivos: visibilidade respeita pode_ver_processo caso associado a processo
create policy ged_arquivos_ver on ged_arquivos for select to authenticated
  using (
    conta_id = conta_atual() and pode('ged', 'ver') and (
      processo_id is null or pode_ver_processo(processo_id)
    )
  );
create policy ged_arquivos_criar on ged_arquivos for insert to authenticated
  with check (conta_id = conta_atual() and pode('ged', 'criar'));
create policy ged_arquivos_editar on ged_arquivos for update to authenticated
  using (conta_id = conta_atual() and pode('ged', 'editar'))
  with check (conta_id = conta_atual() and pode('ged', 'editar'));
create policy ged_arquivos_excluir on ged_arquivos for delete to authenticated
  using (conta_id = conta_atual() and pode('ged', 'excluir'));

-- ged_versoes: módulo 'ged'
create policy ged_versoes_ver on ged_versoes for select to authenticated
  using (conta_id = conta_atual() and pode('ged', 'ver'));
create policy ged_versoes_criar on ged_versoes for insert to authenticated
  with check (conta_id = conta_atual() and pode('ged', 'criar'));
create policy ged_versoes_excluir on ged_versoes for delete to authenticated
  using (conta_id = conta_atual() and pode('ged', 'excluir'));

-- modelos_documento: modelos públicos (conta_id is null) ou da própria conta
create policy modelos_documento_ver on modelos_documento for select to authenticated
  using ((conta_id is null or conta_id = conta_atual()) and pode('ged', 'ver'));
create policy modelos_documento_criar on modelos_documento for insert to authenticated
  with check (conta_id = conta_atual() and pode('ged', 'criar'));
create policy modelos_documento_editar on modelos_documento for update to authenticated
  using (conta_id = conta_atual() and pode('ged', 'editar'))
  with check (conta_id = conta_atual() and pode('ged', 'editar'));
create policy modelos_documento_excluir on modelos_documento for delete to authenticated
  using (conta_id = conta_atual() and pode('ged', 'excluir'));

-- avisos: cada usuário vê seus avisos; dono vê histórico de envios da conta (RF-NOT-13)
create policy avisos_ver on avisos for select to authenticated
  using (
    conta_id = conta_atual() and (
      usuario_id = auth.uid() or perfil_atual() = 'dono'
    )
  );
create policy avisos_criar on avisos for insert to authenticated
  with check (conta_id = conta_atual());
create policy avisos_editar on avisos for update to authenticated
  using (conta_id = conta_atual() and (usuario_id = auth.uid() or perfil_atual() = 'dono'))
  with check (conta_id = conta_atual() and (usuario_id = auth.uid() or perfil_atual() = 'dono'));
create policy avisos_excluir on avisos for delete to authenticated
  using (conta_id = conta_atual() and (usuario_id = auth.uid() or perfil_atual() = 'dono'));

-- preferencias_aviso: usuário gerencia suas preferências; dono pode configurar padrões
create policy preferencias_aviso_ver on preferencias_aviso for select to authenticated
  using (conta_id = conta_atual() and (usuario_id = auth.uid() or perfil_atual() = 'dono'));
create policy preferencias_aviso_criar on preferencias_aviso for insert to authenticated
  with check (conta_id = conta_atual() and (usuario_id = auth.uid() or perfil_atual() = 'dono'));
create policy preferencias_aviso_editar on preferencias_aviso for update to authenticated
  using (conta_id = conta_atual() and (usuario_id = auth.uid() or perfil_atual() = 'dono'))
  with check (conta_id = conta_atual() and (usuario_id = auth.uid() or perfil_atual() = 'dono'));
create policy preferencias_aviso_excluir on preferencias_aviso for delete to authenticated
  using (conta_id = conta_atual() and (usuario_id = auth.uid() or perfil_atual() = 'dono'));

-- Permissões de tabela para authenticated (RLS filtra as linhas)
grant select, insert, update, delete on
  ged_pastas, ged_arquivos, ged_versoes, modelos_documento,
  avisos, preferencias_aviso
to authenticated;
