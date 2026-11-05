-- 99_teste_isolamento.sql
-- Testes de isolamento entre contas e de permissões. Rodar depois de 00 e 01.
-- Cada verificação usa "assert" e para no primeiro erro.
\set ON_ERROR_STOP on

-- Dados fictícios (criados como dono do banco, que ignora a RLS)
insert into contas (id, tipo, nome) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'escritorio', 'Escritorio A (ficticio)'),
  ('bbbbbbbb-0000-0000-0000-000000000001', 'escritorio', 'Escritorio B (ficticio)');

insert into auth.users (id, email) values
  ('a1000000-0000-0000-0000-000000000001', 'dono.a@exemplo.test'),
  ('a1000000-0000-0000-0000-000000000002', 'leitura.a@exemplo.test'),
  ('a1000000-0000-0000-0000-000000000003', 'restrito.a@exemplo.test'),
  ('b1000000-0000-0000-0000-000000000001', 'dono.b@exemplo.test');

insert into usuarios (id, conta_id, nome, email, perfil, restringir_a_responsavel) values
  ('a1000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Dono A',      'dono.a@exemplo.test',     'dono',       false),
  ('a1000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', 'Leitura A',   'leitura.a@exemplo.test',  'leitura',    false),
  ('a1000000-0000-0000-0000-000000000003', 'aaaaaaaa-0000-0000-0000-000000000001', 'Restrito A',  'restrito.a@exemplo.test', 'advogado',   true),
  ('b1000000-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', 'Dono B',      'dono.b@exemplo.test',     'dono',       false);

-- Grupo com permissão de ver/criar/editar processos para o usuário restrito
insert into grupos (id, conta_id, nome) values
  ('c1000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'Advogados');
insert into grupo_permissoes (conta_id, grupo_id, modulo, pode_ver, pode_criar, pode_editar) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'processos', true, true, true);
insert into usuario_grupos (conta_id, usuario_id, grupo_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001');

-- Dois processos na conta A e um na conta B
insert into processos (id, conta_id, numero_cnj) values
  ('d1000000-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', '00000000000000000001'),
  ('d1000000-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '00000000000000000002'),
  ('d2000000-0000-0000-0000-000000000001', 'bbbbbbbb-0000-0000-0000-000000000001', '00000000000000000001');

-- O usuário restrito é responsável apenas pelo processo 1 da conta A
insert into responsaveis_processo (conta_id, processo_id, usuario_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003');

-- ---------------------------------------------------------------------------
-- Simula o login: papel "authenticated" + id do usuário
-- ---------------------------------------------------------------------------
create or replace function pg_temp.entrar_como(p_id uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', p_id::text, false);
end $$;

set role authenticated;

-- 1) Dono A enxerga só a conta A
select pg_temp.entrar_como('a1000000-0000-0000-0000-000000000001');
do $$ begin
  assert (select count(*) from processos) = 2, 'Dono A deveria ver 2 processos';
  assert (select count(*) from contas) = 1, 'Dono A deveria ver 1 conta';
  assert (select count(*) from usuarios) = 3, 'Dono A deveria ver 3 usuarios da conta A';
end $$;

-- 2) Dono A não consegue enxergar processo da conta B, nem informando o id
do $$ begin
  assert (select count(*) from processos where id = 'd2000000-0000-0000-0000-000000000001') = 0,
    'Dono A viu processo da conta B';
end $$;

-- 3) Dono A não consegue inserir dado na conta B
do $$
declare v_falhou boolean := false;
begin
  begin
    insert into processos (conta_id, numero_cnj) values ('bbbbbbbb-0000-0000-0000-000000000001', '00000000000000000009');
  exception when others then v_falhou := true;
  end;
  assert v_falhou, 'Dono A conseguiu inserir processo na conta B';
end $$;

-- 4) Dono A não altera nem apaga dados da conta B (0 linhas afetadas)
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

-- 5) Dono B enxerga só a conta B
select pg_temp.entrar_como('b1000000-0000-0000-0000-000000000001');
do $$ begin
  assert (select count(*) from processos) = 1, 'Dono B deveria ver 1 processo';
  assert (select count(*) from usuarios) = 1, 'Dono B deveria ver 1 usuario';
end $$;

-- 6) Perfil leitura vê, mas não escreve
select pg_temp.entrar_como('a1000000-0000-0000-0000-000000000002');
do $$
declare v_falhou boolean := false;
begin
  -- leitura: sem grupo, então nem vê (permissão vem dos grupos)
  assert (select count(*) from processos) = 0, 'Leitura sem grupo nao deveria ver processos';
  begin
    insert into processos (conta_id, numero_cnj) values ('aaaaaaaa-0000-0000-0000-000000000001', '00000000000000000008');
  exception when others then v_falhou := true;
  end;
  assert v_falhou, 'Perfil leitura conseguiu inserir';
end $$;

-- 7) Usuário restrito só vê o processo em que é responsável
select pg_temp.entrar_como('a1000000-0000-0000-0000-000000000003');
do $$ begin
  assert (select count(*) from processos) = 1, 'Restrito deveria ver 1 processo';
  assert (select numero_cnj from processos) = '00000000000000000001', 'Restrito viu o processo errado';
end $$;

-- 8) Sem login, nada aparece
select set_config('request.jwt.claim.sub', '', false);
do $$ begin
  assert (select count(*) from processos) = 0, 'Sem login viu processos';
  assert (select count(*) from contas) = 0, 'Sem login viu contas';
end $$;

-- 9) Usuário sem permissão de gerir usuários não se promove a dono
select pg_temp.entrar_como('a1000000-0000-0000-0000-000000000003');
do $$
declare v int;
begin
  update usuarios set perfil = 'dono' where id = 'a1000000-0000-0000-0000-000000000003';
  get diagnostics v = row_count;
  assert v = 0, 'Usuario conseguiu se promover a dono';
end $$;

reset role;
\echo 'TODOS OS TESTES DE ISOLAMENTO PASSARAM'
