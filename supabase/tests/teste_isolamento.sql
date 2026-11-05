-- supabase/tests/teste_isolamento.sql
-- Testes de isolamento entre contas e de permissões adaptado para o Supabase.
-- Baseado em docs/base-sql/99_teste_isolamento.sql.
-- Preenche as colunas obrigatórias de auth.users do Supabase.

\set ON_ERROR_STOP on

-- Limpa dados de testes anteriores se existirem (em ordem inversa de dependência)
delete from responsaveis_processo where conta_id in ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001');
delete from processos where conta_id in ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001');
delete from usuario_grupos where conta_id in ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001');
delete from grupo_permissoes where conta_id in ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001');
delete from grupos where conta_id in ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001');
delete from usuarios where conta_id in ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001');
delete from auth.users where id in (
  'a1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000003',
  'b1000000-0000-0000-0000-000000000001'
);
delete from contas where id in ('aaaaaaaa-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001');

-- 1. Contas de teste
insert into contas (id, tipo, nome) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'escritorio', 'Escritorio A (ficticio)'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'escritorio', 'Escritorio B (ficticio)');

-- 2. auth.users com todas as colunas obrigatórias do Supabase
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values
  ('a1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dono.a@exemplo.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'leitura.a@exemplo.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('a1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'restrito.a@exemplo.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('b1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dono.b@exemplo.test', '', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());

-- 3. Tabela usuarios do sistema
insert into usuarios (id, conta_id, nome, email, perfil, restringir_a_responsavel) values
  ('a1000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Dono A',      'dono.a@exemplo.test',     'dono',       false),
  ('a1000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Leitura A',   'leitura.a@exemplo.test',  'leitura',    false),
  ('a1000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'Restrito A',  'restrito.a@exemplo.test', 'advogado',   true),
  ('b1000000-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Dono B',      'dono.b@exemplo.test',     'dono',       false);

-- 4. Grupos e Permissões
insert into grupos (id, conta_id, nome) values
  ('c1000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Advogados');
insert into grupo_permissoes (conta_id, grupo_id, modulo, pode_ver, pode_criar, pode_editar) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'processos', true, true, true);
insert into usuario_grupos (conta_id, usuario_id, grupo_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001');

-- 5. Processos
insert into processos (id, conta_id, numero_cnj) values
  ('d1000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '00000000000000000001'),
  ('d1000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '00000000000000000002'),
  ('d2000000-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '00000000000000000001');

-- 6. Responsáveis
insert into responsaveis_processo (conta_id, processo_id, usuario_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003');

-- ---------------------------------------------------------------------------
-- Função de auxílio para simular login no Supabase
-- ---------------------------------------------------------------------------
create or replace function pg_temp.entrar_como(p_id uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', p_id::text, false);
  perform set_config('request.jwt.claims', json_build_object('sub', p_id::text, 'role', 'authenticated')::text, false);
end $$;

set role authenticated;

-- Teste 1: Dono A enxerga só a conta A
select pg_temp.entrar_como('a1000000-0000-0000-0000-000000000001');
do $$ begin
  assert (select count(*) from processos) = 2, 'Dono A deveria ver 2 processos';
  assert (select count(*) from contas) = 1, 'Dono A deveria ver 1 conta';
  assert (select count(*) from usuarios) = 3, 'Dono A deveria ver 3 usuarios da conta A';
end $$;

-- Teste 2: Dono A não consegue enxergar processo da conta B, nem informando o id
do $$ begin
  assert (select count(*) from processos where id = 'd2000000-0000-0000-0000-000000000001') = 0,
    'Dono A viu processo da conta B';
end $$;

-- Teste 3: Dono A não consegue inserir dado na conta B
do $$
declare v_falhou boolean := false;
begin
  begin
    insert into processos (conta_id, numero_cnj) values ('bbbbbbbb-0000-0000-0000-000000000001', '00000000000000000009');
  exception when others then v_falhou := true;
  end;
  assert v_falhou, 'Dono A conseguiu inserir processo na conta B';
end $$;

-- Teste 4: Dono A não altera nem apaga dados da conta B
do $$
declare v int;
begin
  update processos set observacoes = 'invadido' where id = 'd2000000-0000-0000-0000-000000000001';
  get diagnostics v = row_count;
  assert v = 0, 'Dono A alterou processo da conta B';
  delete from processos where id = 'd2000000-0000-0000-0000-000000000001';
  get diagnostics v = row_count;
  assert v = 0, 'Dono A apagou processo da conta B';
end $$;

-- Teste 5: Dono B enxerga só a conta B
select pg_temp.entrar_como('b1000000-0000-0000-0000-000000000001');
do $$ begin
  assert (select count(*) from processos) = 1, 'Dono B deveria ver 1 processo';
  assert (select count(*) from usuarios) = 1, 'Dono B deveria ver 1 usuario';
end $$;

-- Teste 6: Perfil leitura sem grupo não vê processos e não consegue inserir
select pg_temp.entrar_como('a1000000-0000-0000-0000-000000000002');
do $$
declare v_falhou boolean := false;
begin
  assert (select count(*) from processos) = 0, 'Leitura sem grupo nao deveria ver processos';
  begin
    insert into processos (conta_id, numero_cnj) values ('aaaaaaaa-0000-0000-0000-000000000001', '00000000000000000008');
  exception when others then v_falhou := true;
  end;
  assert v_falhou, 'Perfil leitura conseguiu inserir';
end $$;

-- Teste 7: Usuário restrito só vê o processo em que é responsável
select pg_temp.entrar_como('a1000000-0000-0000-0000-000000000003');
do $$ begin
  assert (select count(*) from processos) = 1, 'Restrito deveria ver 1 processo';
  assert (select numero_cnj from processos) = '00000000000000000001', 'Restrito viu o processo errado';
end $$;

-- Teste 8: Sem login, nada aparece
select set_config('request.jwt.claim.sub', '', false);
select set_config('request.jwt.claims', '{}', false);
do $$ begin
  assert (select count(*) from processos) = 0, 'Sem login viu processos';
  assert (select count(*) from contas) = 0, 'Sem login viu contas';
end $$;

-- Teste 9: Usuário sem permissão de gerir usuários não se promove a dono
select pg_temp.entrar_como('a1000000-0000-0000-0000-000000000003');
do $$
declare v int;
begin
  update usuarios set perfil = 'dono' where id = 'a1000000-0000-0000-0000-000000000003';
  get diagnostics v = row_count;
  assert v = 0, 'Usuario conseguiu se promover a dono';
end $$;

reset role;
select 'TODOS OS TESTES DE ISOLAMENTO PASSARAM' as resultado;
