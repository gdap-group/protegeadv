-- supabase/tests/teste_isolamento_completo.sql
-- Teste completo de isolamento multi-tenant e controle de acesso (RLS)
-- Cobre automaticamente todas as tabelas do schema public.
-- Compatível com Supabase real e PGlite.

\set ON_ERROR_STOP on

begin;

-- Garante que em ambientes Postgres puros / PGlite as permissões de tabela existam
-- (no Supabase hosted isso é configurado nativamente nas default privileges).
grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
grant usage, select on all sequences in schema public to authenticated;

-- Funções auxiliares temporárias para simular contexto de autenticação Supabase
create or replace function pg_temp.entrar_como(p_id uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', p_id::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', p_id::text, 'role', 'authenticated')::text, true);
end $$;

create or replace function pg_temp.deslogar() returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', '', true);
  perform set_config('request.jwt.claim.role', 'anon', true);
  perform set_config('request.jwt.claims', '{}'::text, true);
end $$;

do $$
declare
  v_tabelas_varridas int := 0;
  v_assercoes_executadas int := 0;
  v_falhas int := 0;
  v_mensagens_falha text[] := '{}';
  
  v_conta_a uuid := '11111111-1111-1111-1111-111111111111';
  v_user_a uuid  := '10000000-0000-0000-0000-000000000001'; -- Dono A
  v_adv_a  uuid  := '10000000-0000-0000-0000-000000000002'; -- Advogada Mariana A
  v_estag_a uuid := '10000000-0000-0000-0000-000000000003'; -- Estagiário Pedro A

  v_conta_b uuid := '22222222-2222-2222-2222-222222222222';
  v_user_b uuid  := '20000000-0000-0000-0000-000000000001'; -- Dono B
  v_leitura_b uuid := '20000000-0000-0000-0000-000000000003'; -- Leitura Auditoria B

  v_novo_contrato_id uuid;
  v_contrato_sem_proc uuid;

  r record;
  v_count int;
  v_affected int;
  v_err_caught boolean;
begin
  -- =========================================================================
  -- REQUISITO 1: Catálogo - RLS ligada e pelo menos 1 política em todas as tabelas
  -- =========================================================================
  for r in (
    select c.oid, c.relname as tabela, c.relrowsecurity, count(p.polname) as num_politicas
    from pg_class c
    left join pg_policy p on p.polrelid = c.oid
    where c.relnamespace = 'public'::regnamespace
      and c.relkind = 'r'
    group by c.oid, c.relname, c.relrowsecurity
    order by c.relname
  ) loop
    v_tabelas_varridas := v_tabelas_varridas + 1;
    v_assercoes_executadas := v_assercoes_executadas + 1;
    if not r.relrowsecurity then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 1: Tabela ' || r.tabela || ' está com RLS DESLIGADA.');
    end if;

    v_assercoes_executadas := v_assercoes_executadas + 1;
    if r.num_politicas = 0 then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 1: Tabela ' || r.tabela || ' tem 0 políticas de RLS.');
    end if;

    v_assercoes_executadas := v_assercoes_executadas + 1;
    if not exists (
      select 1 from pg_policy p
      where p.polrelid = r.oid and p.polcmd in ('r', '*')
    ) then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 1: Tabela ' || r.tabela || ' não possui política de leitura (SELECT).');
    end if;
  end loop;

  -- =========================================================================
  -- REQUISITO 2: Isolamento Cruzado entre Conta A e Conta B
  -- =========================================================================
  -- Dono A contra Conta B
  perform pg_temp.entrar_como(v_user_a);

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contas where id = v_conta_b;
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 2: Dono A conseguiu ver a linha da Conta B na tabela contas.');
  end if;

  for r in (
    select table_name as tabela
    from information_schema.columns
    where table_schema = 'public'
      and column_name = 'conta_id'
    order by table_name
  ) loop
    -- SELECT
    v_assercoes_executadas := v_assercoes_executadas + 1;
    execute format('select count(*) from %I where conta_id = %L', r.tabela, v_conta_b) into v_count;
    if v_count <> 0 then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 2: Dono A enxergou ' || v_count || ' linha(s) da Conta B em ' || r.tabela);
    end if;

    -- UPDATE
    v_assercoes_executadas := v_assercoes_executadas + 1;
    begin
      execute format('update %I set atualizado_em = now() where conta_id = %L', r.tabela, v_conta_b);
      get diagnostics v_affected = row_count;
      if v_affected <> 0 then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 2: Dono A atualizou ' || v_affected || ' linha(s) da Conta B em ' || r.tabela);
      end if;
    exception when others then
      null;
    end;

    -- DELETE
    v_assercoes_executadas := v_assercoes_executadas + 1;
    begin
      execute format('delete from %I where conta_id = %L', r.tabela, v_conta_b);
      get diagnostics v_affected = row_count;
      if v_affected <> 0 then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 2: Dono A apagou ' || v_affected || ' linha(s) da Conta B em ' || r.tabela);
      end if;
    exception when others then
      null;
    end;
  end loop;

  -- Dono B contra Conta A
  perform pg_temp.entrar_como(v_user_b);

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contas where id = v_conta_a;
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 2: Dono B conseguiu ver a linha da Conta A na tabela contas.');
  end if;

  for r in (
    select table_name as tabela
    from information_schema.columns
    where table_schema = 'public'
      and column_name = 'conta_id'
    order by table_name
  ) loop
    v_assercoes_executadas := v_assercoes_executadas + 1;
    execute format('select count(*) from %I where conta_id = %L', r.tabela, v_conta_a) into v_count;
    if v_count <> 0 then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 2: Dono B enxergou ' || v_count || ' linha(s) da Conta A em ' || r.tabela);
    end if;

    v_assercoes_executadas := v_assercoes_executadas + 1;
    begin
      execute format('update %I set atualizado_em = now() where conta_id = %L', r.tabela, v_conta_a);
      get diagnostics v_affected = row_count;
      if v_affected <> 0 then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 2: Dono B atualizou ' || v_affected || ' linha(s) da Conta A em ' || r.tabela);
      end if;
    exception when others then
      null;
    end;

    v_assercoes_executadas := v_assercoes_executadas + 1;
    begin
      execute format('delete from %I where conta_id = %L', r.tabela, v_conta_a);
      get diagnostics v_affected = row_count;
      if v_affected <> 0 then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 2: Dono B apagou ' || v_affected || ' linha(s) da Conta A em ' || r.tabela);
      end if;
    exception when others then
      null;
    end;
  end loop;

  -- =========================================================================
  -- REQUISITO 3: Verificação Estática do Catálogo (INSERT e UPDATE com with check)
  -- =========================================================================
  for r in (
    select
      c.relname as tabela,
      p.polname as politica,
      p.polcmd,
      pg_get_expr(p.polwithcheck, p.polrelid) as with_check,
      pg_get_expr(p.polqual, p.polrelid) as pol_qual
    from pg_policy p
    join pg_class c on c.oid = p.polrelid
    where c.relnamespace = 'public'::regnamespace
      and p.polcmd in ('a', 'w', '*')
    order by c.relname, p.polname
  ) loop
    v_assercoes_executadas := v_assercoes_executadas + 1;
    if r.with_check is null then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 3: Política ' || r.politica || ' em ' || r.tabela || ' não possui cláusula WITH CHECK.');
    elsif r.tabela = 'contas' then
      if r.with_check not like '%conta_atual()%' then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 3: Política ' || r.politica || ' em contas não exige id = conta_atual().');
      end if;
    else
      if r.with_check not like '%conta_atual()%' then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 3: Política ' || r.politica || ' em ' || r.tabela || ' não exige conta_atual() no WITH CHECK.');
      end if;
    end if;

    if r.tabela in ('contratos', 'contrato_partes', 'contrato_processos') then
      v_assercoes_executadas := v_assercoes_executadas + 1;
      if r.with_check is not null and r.with_check not like '%perfil_atual()%' then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 3: Política ' || r.politica || ' em ' || r.tabela || ' não exige perfil_atual() no WITH CHECK.');
      end if;
    end if;
  end loop;

  -- Verificação estática de pode_ver_contrato() em TODAS as políticas de contratos
  for r in (
    select
      c.relname as tabela,
      p.polname as politica,
      p.polcmd,
      pg_get_expr(p.polwithcheck, p.polrelid) as with_check,
      pg_get_expr(p.polqual, p.polrelid) as pol_qual
    from pg_policy p
    join pg_class c on c.oid = p.polrelid
    where c.relnamespace = 'public'::regnamespace
      and c.relname in ('contratos', 'contrato_partes', 'contrato_processos')
    order by c.relname, p.polname
  ) loop
    v_assercoes_executadas := v_assercoes_executadas + 1;
    if r.politica <> 'contratos_criar' then
      if coalesce(r.pol_qual, '') not like '%pode_ver_contrato%'
         and coalesce(r.with_check, '') not like '%pode_ver_contrato%' then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 3: Política ' || r.politica || ' em ' || r.tabela || ' não exige pode_ver_contrato().');
      end if;
    end if;
  end loop;

  -- =========================================================================
  -- REQUISITO 4: Inserção Cruzada (como Dono A tentando inserir na Conta B)
  -- =========================================================================
  perform pg_temp.entrar_como(v_user_a);

  -- processos
  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_err_caught := false;
  begin
    insert into processos (conta_id, numero_cnj) values (v_conta_b, '99999999999999999999');
  exception when others then
    v_err_caught := true;
  end;
  if not v_err_caught then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 4: Usuário A conseguiu inserir processo na Conta B.');
  end if;

  -- pessoas
  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_err_caught := false;
  begin
    insert into pessoas (conta_id, tipo, nome) values (v_conta_b, 'pf', 'Pessoa Invasora');
  exception when others then
    v_err_caught := true;
  end;
  if not v_err_caught then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 4: Usuário A conseguiu inserir pessoa na Conta B.');
  end if;

  -- compromissos
  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_err_caught := false;
  begin
    insert into compromissos (conta_id, titulo, data_hora_inicio) values (v_conta_b, 'Compromisso Invasor', now());
  exception when others then
    v_err_caught := true;
  end;
  if not v_err_caught then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 4: Usuário A conseguiu inserir compromisso na Conta B.');
  end if;

  -- contratos
  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_err_caught := false;
  begin
    insert into contratos (conta_id, codigo, data_inicio) values (v_conta_b, 'INV-CTR-01', current_date);
  exception when others then
    v_err_caught := true;
  end;
  if not v_err_caught then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 4: Usuário A conseguiu inserir contrato na Conta B.');
  end if;

  -- publicacoes
  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_err_caught := false;
  begin
    insert into publicacoes (conta_id, id_comunicacao, tribunal, data_disponibilizacao, tipo, teor)
    values (v_conta_b, 'pub-invasora', 'TJSP', current_date, 'Intimação', 'Teor de teste');
  exception when others then
    v_err_caught := true;
  end;
  if not v_err_caught then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 4: Usuário A conseguiu inserir publicação na Conta B.');
  end if;

  -- =========================================================================
  -- REQUISITO 5: Casos de Perfil (Estagiário, Leitura, Dono, Advogado Restrito)
  -- =========================================================================
  -- 5.1 Estagiário Pedro A
  perform pg_temp.entrar_como(v_estag_a);

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contratos;
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Estagiário conseguiu ler tabela contratos (' || v_count || ' linhas).');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contrato_partes;
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Estagiário conseguiu ler tabela contrato_partes (' || v_count || ' linhas).');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contrato_processos;
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Estagiário conseguiu ler tabela contrato_processos (' || v_count || ' linhas).');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_err_caught := false;
  begin
    insert into contratos (conta_id, codigo, data_inicio) values (v_conta_a, 'ESTAG-001', current_date);
  exception when others then
    v_err_caught := true;
  end;
  if not v_err_caught then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Estagiário conseguiu inserir em contratos.');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_err_caught := false;
  begin
    insert into contrato_partes (conta_id, contrato_id, papel)
    values (v_conta_a, '10000000-0000-0000-0000-000000000130', 'contratante');
  exception when others then
    v_err_caught := true;
  end;
  if not v_err_caught then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Estagiário conseguiu inserir em contrato_partes.');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_err_caught := false;
  begin
    insert into contrato_processos (conta_id, contrato_id, processo_id)
    values (v_conta_a, '10000000-0000-0000-0000-000000000130', '11000000-0000-0000-0000-000000000001');
  exception when others then
    v_err_caught := true;
  end;
  if not v_err_caught then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Estagiário conseguiu inserir em contrato_processos.');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  v_affected := 0;
  begin
    delete from processos where conta_id = v_conta_a;
    get diagnostics v_affected = row_count;
  exception when others then
    v_affected := 0;
  end;
  if v_affected <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Estagiário conseguiu excluir ' || v_affected || ' processo(s).');
  end if;

  -- 5.2 Perfil Leitura (Auditoria B)
  perform pg_temp.entrar_como(v_leitura_b);

  for r in (
    select table_name as tabela
    from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  ) loop
    v_assercoes_executadas := v_assercoes_executadas + 1;
    v_affected := 0;
    begin
      execute format('update %I set atualizado_em = now() where conta_id = %L', r.tabela, v_conta_b);
      get diagnostics v_affected = row_count;
    exception when others then
      v_affected := 0;
    end;
    if v_affected <> 0 then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Perfil leitura conseguiu dar UPDATE em ' || r.tabela);
    end if;

    v_assercoes_executadas := v_assercoes_executadas + 1;
    v_affected := 0;
    begin
      execute format('delete from %I where conta_id = %L', r.tabela, v_conta_b);
      get diagnostics v_affected = row_count;
    exception when others then
      v_affected := 0;
    end;
    if v_affected <> 0 then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Perfil leitura conseguiu dar DELETE em ' || r.tabela);
    end if;
  end loop;

  -- 5.3 Dono A vê tudo da própria conta
  perform pg_temp.entrar_como(v_user_a);

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from processos;
  if v_count <> 20 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Dono A deveria ver 20 processos, viu ' || v_count);
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contratos;
  if v_count <> 2 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Dono A deveria ver 2 contratos, viu ' || v_count);
  end if;

  -- 5.4 Advogado com restringir_a_responsavel = true (Mariana A)
  update usuarios set restringir_a_responsavel = true where id = v_adv_a;
  insert into grupo_permissoes (conta_id, grupo_id, modulo, pode_ver, pode_criar, pode_editar, pode_excluir)
  values (v_conta_a, '10000000-0000-0000-0000-000000000010', 'contratos', true, true, true, false)
  on conflict do nothing;
  insert into grupo_permissoes (conta_id, grupo_id, modulo, pode_ver, pode_criar, pode_editar, pode_excluir)
  values (v_conta_a, '10000000-0000-0000-0000-000000000010', 'agenda', true, true, true, false)
  on conflict do nothing;

  perform pg_temp.entrar_como(v_adv_a);

  -- Processos: vê apenas os 10 em que é responsável
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from processos;
  if v_count <> 10 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita deveria ver 10 processos, viu ' || v_count);
  end if;

  -- Andamentos: não vê andamentos de processos aos quais não tem acesso
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count
  from andamentos
  where processo_id not in (select id from processos);
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita viu ' || v_count || ' andamento(s) de processos não permitidos.');
  end if;

  -- Partes: não vê partes de processos aos quais não tem acesso
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count
  from partes_processo
  where processo_id not in (select id from processos);
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita viu ' || v_count || ' parte(s) de processos não permitidos.');
  end if;

  -- Compromissos: não vê compromissos vinculados a processos aos quais não tem acesso
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count
  from compromissos
  where processo_id is not null and processo_id not in (select id from processos);
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita viu ' || v_count || ' compromisso(s) de processos não permitidos.');
  end if;

  -- -------------------------------------------------------------------------
  -- Casos de Visibilidade Granular de Contratos (0010)
  -- -------------------------------------------------------------------------
  -- Caso 1: Advogado restrito NÃO vê contrato ligado só a processo que não pode ver
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contratos where id = '10000000-0000-0000-0000-000000000130';
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita viu contrato ligado exclusivamente a processo que não pode ver.');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contrato_processos where contrato_id = '10000000-0000-0000-0000-000000000130';
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogado restrito conseguiu ver vínculo em contrato_processos de processo restrito.');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contrato_partes where contrato_id = '10000000-0000-0000-0000-000000000130';
  if v_count <> 0 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita viu partes de contrato ao qual não tem acesso.');
  end if;

  -- Caso 2: Advogado restrito VÊ contrato ligado a processo que pode ver
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contratos where id = '10000000-0000-0000-0000-000000000131';
  if v_count <> 1 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita deveria ver contrato ligado a processo permitido, viu ' || v_count);
  end if;

  -- Caso 3: Advogado restrito VÊ contrato em que é parte (mesmo sem processo vinculado)
  perform pg_temp.entrar_como(v_user_a);
  insert into contratos (conta_id, codigo, data_inicio)
  values (v_conta_a, 'HON-PARTE-SEM-PROC', current_date)
  returning id into v_contrato_sem_proc;

  insert into contrato_partes (conta_id, contrato_id, usuario_id, papel)
  values (v_conta_a, v_contrato_sem_proc, v_adv_a, 'responsavel');

  perform pg_temp.entrar_como(v_adv_a);
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contratos where id = v_contrato_sem_proc;
  if v_count <> 1 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita não viu contrato sem processos onde ela é parte.');
  end if;

  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contrato_partes where contrato_id = v_contrato_sem_proc;
  if v_count <> 1 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita não viu sua própria parte no contrato.');
  end if;

  -- Caso 4: Criador restrito VÊ o contrato que acabou de criar (inclusive insert com returning)
  v_assercoes_executadas := v_assercoes_executadas + 1;
  begin
    insert into contratos (conta_id, codigo, data_inicio)
    values (v_conta_a, 'HON-CRIADO-POR-MARIANA', current_date)
    returning id into v_novo_contrato_id;
  exception when others then
    v_novo_contrato_id := null;
  end;

  if v_novo_contrato_id is null then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita falhou ao criar contrato com RETURNING.');
  else
    select count(*) into v_count from contratos where id = v_novo_contrato_id;
    if v_count <> 1 then
      v_falhas := v_falhas + 1;
      v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada restrita não conseguiu ver o contrato que acabou de criar.');
    end if;
  end if;

  -- Caso 5: Dono e advogado sem restrição veem todos os contratos
  perform pg_temp.entrar_como(v_user_a);
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contratos;
  -- 2 do seed + 1 criado para parte + 1 criado por Mariana = 4
  if v_count <> 4 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Dono A deveria ver 4 contratos, viu ' || v_count);
  end if;

  update usuarios set restringir_a_responsavel = false where id = v_adv_a;
  perform pg_temp.entrar_como(v_adv_a);
  v_assercoes_executadas := v_assercoes_executadas + 1;
  select count(*) into v_count from contratos;
  if v_count <> 4 then
    v_falhas := v_falhas + 1;
    v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 5: Advogada SEM restrição deveria ver 4 contratos, viu ' || v_count);
  end if;

  update usuarios set restringir_a_responsavel = true where id = v_adv_a;

  -- =========================================================================
  -- REQUISITO 6: Usuário sem login (role anon)
  -- =========================================================================
  perform pg_temp.deslogar();

  for r in (
    select table_name as tabela
    from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  ) loop
    v_assercoes_executadas := v_assercoes_executadas + 1;
    begin
      execute format('select count(*) from %I', r.tabela) into v_count;
      if v_count <> 0 then
        v_falhas := v_falhas + 1;
        v_mensagens_falha := array_append(v_mensagens_falha, 'Requisito 6: Usuário anônimo conseguiu ler ' || v_count || ' linha(s) de ' || r.tabela);
      end if;
    exception when others then
      -- Permissão negada ou restrição de RLS é esperado e válido
      null;
    end;
  end loop;

  -- =========================================================================
  -- REQUISITO 8: Relatório Final e Validação
  -- =========================================================================
  raise notice '==================================================';
  raise notice 'RESUMO DO TESTE DE ISOLAMENTO COMPLETO';
  raise notice 'Tabelas varridas: %', v_tabelas_varridas;
  raise notice 'Asserções executadas: %', v_assercoes_executadas;
  raise notice 'Total de falhas: %', v_falhas;
  raise notice '==================================================';

  if v_falhas > 0 then
    raise exception 'TESTE DE ISOLAMENTO FALHOU com % falha(s): %', v_falhas, array_to_string(v_mensagens_falha, E'\n- ');
  else
    raise notice 'TODAS AS % ASSERÇÕES PASSARAM COM SUCESSO!', v_assercoes_executadas;
  end if;
end $$;

rollback;
