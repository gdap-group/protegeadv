-- supabase/migrations/0007_pessoas.sql
-- Módulo Pessoas: pessoas físicas/jurídicas, contatos, outros nomes e vínculos com processos e empresas
-- Conforme Seção 10 e Seção 18 do PRD

-- ---------------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------------
create type pessoa_tipo as enum ('pf', 'pj');
create type pessoa_perfil as enum ('cliente', 'parte_contraria', 'advogado', 'testemunha', 'outro', 'orgao');

-- ---------------------------------------------------------------------------
-- 1. Pessoas (Cadastro Centralizado)
-- ---------------------------------------------------------------------------
create table pessoas (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas(id) on delete cascade,
  tipo          pessoa_tipo not null,
  nome          text not null,
  nome_fantasia text,
  cpf_cnpj      text,
  perfis        pessoa_perfil[] not null default '{}',
  dados_pf      jsonb default '{}'::jsonb, -- mãe, pai, nascimento, profissão, estado civil
  observacoes   text,
  excluido_em   timestamptz,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table pessoas is 'Cadastro centralizado de clientes, partes, advogados e órgãos.';
comment on column pessoas.cpf_cnpj is 'CPF ou CNPJ normalizado, único por conta quando preenchido e não excluído.';

create index pessoas_conta_idx on pessoas (conta_id);
create unique index pessoas_conta_cpf_cnpj_uidx on pessoas (conta_id, cpf_cnpj)
  where cpf_cnpj is not null and excluido_em is null;

create trigger tr_pessoas_atualizado_em
  before update on pessoas
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 2. Contatos da Pessoa (Telefones, WhatsApp, E-mails, Endereços)
-- ---------------------------------------------------------------------------
create table pessoa_contatos (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas(id) on delete cascade,
  pessoa_id     uuid not null references pessoas(id) on delete cascade,
  tipo          text not null, -- telefone, email, endereco, whatsapp
  valor         text not null,
  rotulo        text, -- principal, celular, comercial, residencial
  is_whatsapp   boolean not null default false,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table pessoa_contatos is 'Meios de contato e endereços vinculados à pessoa.';

create index pessoa_contatos_conta_idx on pessoa_contatos (conta_id);
create index pessoa_contatos_pessoa_idx on pessoa_contatos (pessoa_id);

create trigger tr_pessoa_contatos_atualizado_em
  before update on pessoa_contatos
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 3. Outros Nomes / Variações de Grafia (para monitoramento)
-- ---------------------------------------------------------------------------
create table pessoa_outros_nomes (
  id            uuid primary key default gen_random_uuid(),
  conta_id      uuid not null references contas(id) on delete cascade,
  pessoa_id     uuid not null references pessoas(id) on delete cascade,
  nome          text not null,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table pessoa_outros_nomes is 'Variações de nome da pessoa para uso nos monitoramentos de DJEN e distribuição.';

create index pessoa_outros_nomes_conta_idx on pessoa_outros_nomes (conta_id);
create index pessoa_outros_nomes_pessoa_idx on pessoa_outros_nomes (pessoa_id);

create trigger tr_pessoa_outros_nomes_atualizado_em
  before update on pessoa_outros_nomes
  for each row execute function definir_atualizado_em();

-- ---------------------------------------------------------------------------
-- 4. Vínculos e Chaves Estrangeiras com Tabelas Anteriores
-- ---------------------------------------------------------------------------
alter table partes_processo
  add constraint partes_processo_pessoa_fk
  foreign key (pessoa_id) references pessoas(id) on delete set null;

alter table empresas_monitoradas
  add constraint empresas_monitoradas_pessoa_fk
  foreign key (pessoa_id) references pessoas(id) on delete set null;

-- ---------------------------------------------------------------------------
-- 5. Row Level Security (RLS) e Políticas
-- ---------------------------------------------------------------------------
alter table pessoas             enable row level security;
alter table pessoa_contatos     enable row level security;
alter table pessoa_outros_nomes enable row level security;

-- Políticas para pessoas
create policy pessoas_ver on pessoas for select to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'ver'));

create policy pessoas_criar on pessoas for insert to authenticated
  with check (conta_id = conta_atual() and pode('pessoas', 'criar'));

create policy pessoas_editar on pessoas for update to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'editar'))
  with check (conta_id = conta_atual() and pode('pessoas', 'editar'));

create policy pessoas_excluir on pessoas for delete to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'excluir'));

-- Políticas para pessoa_contatos
create policy pessoa_contatos_ver on pessoa_contatos for select to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'ver'));

create policy pessoa_contatos_criar on pessoa_contatos for insert to authenticated
  with check (conta_id = conta_atual() and pode('pessoas', 'criar'));

create policy pessoa_contatos_editar on pessoa_contatos for update to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'editar'))
  with check (conta_id = conta_atual() and pode('pessoas', 'editar'));

create policy pessoa_contatos_excluir on pessoa_contatos for delete to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'excluir'));

-- Políticas para pessoa_outros_nomes
create policy pessoa_outros_nomes_ver on pessoa_outros_nomes for select to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'ver'));

create policy pessoa_outros_nomes_criar on pessoa_outros_nomes for insert to authenticated
  with check (conta_id = conta_atual() and pode('pessoas', 'criar'));

create policy pessoa_outros_nomes_editar on pessoa_outros_nomes for update to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'editar'))
  with check (conta_id = conta_atual() and pode('pessoas', 'editar'));

create policy pessoa_outros_nomes_excluir on pessoa_outros_nomes for delete to authenticated
  using (conta_id = conta_atual() and pode('pessoas', 'excluir'));

