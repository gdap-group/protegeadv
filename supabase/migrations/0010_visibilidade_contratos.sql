-- supabase/migrations/0010_visibilidade_contratos.sql
-- Regras de visibilidade granular de contratos, partes e processos vinculados
-- Conforme PRD Seções 3, 12 e 18

-- ---------------------------------------------------------------------------
-- 1. Remoção de coluna valor (não prevista no PRD Seções 12 e 18)
-- ---------------------------------------------------------------------------
alter table contratos drop column if exists valor;

-- ---------------------------------------------------------------------------
-- 2. Coluna criado_por em contratos (para permitir visualização imediata pelo criador)
-- ---------------------------------------------------------------------------
alter table contratos
  add column if not exists criado_por uuid references usuarios(id) on delete set null default auth.uid();

create index if not exists contratos_criado_por_idx on contratos (criado_por);

-- ---------------------------------------------------------------------------
-- 3. Função pode_ver_contrato (Security Definer para evitar recursão de RLS)
-- ---------------------------------------------------------------------------
create or replace function public.pode_ver_contrato(p_contrato_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_perfil perfil_usuario;
  v_restrito boolean;
begin
  -- 1. Estagiário e somente leitura são terminantemente bloqueados
  v_perfil := perfil_atual();
  if v_perfil not in ('dono', 'advogado') then
    return false;
  end if;

  -- 2. Exige permissão no módulo 'contratos'
  if not pode('contratos', 'ver') then
    return false;
  end if;

  -- 3. Perfil dono: vê qualquer contrato da própria conta
  if v_perfil = 'dono' then
    return exists (
      select 1 from contratos c
       where c.id = p_contrato_id
         and c.conta_id = conta_atual()
    );
  end if;

  -- 4. Advogado: verifica se possui restrição a responsável
  select coalesce(u.restringir_a_responsavel, false) into v_restrito
    from usuarios u
   where u.id = auth.uid()
     and u.ativo;

  -- Advogado sem restrição: vê qualquer contrato da própria conta
  if not v_restrito then
    return exists (
      select 1 from contratos c
       where c.id = p_contrato_id
         and c.conta_id = conta_atual()
    );
  end if;

  -- 5. Advogado com restringir_a_responsavel:
  -- Vê o contrato SOMENTE se:
  --   (a) é o criador do contrato (criado_por = auth.uid()), OU
  --   (b) é parte dele em contrato_partes (usuario_id = auth.uid()), OU
  --   (c) o contrato está ligado, em contrato_processos, a pelo menos um processo para o qual pode_ver_processo() é verdadeiro.
  -- (Um contrato sem nenhum processo vinculado só é visível se ele for parte ou criador).
  return exists (
    select 1 from contratos c
     where c.id = p_contrato_id
       and c.conta_id = conta_atual()
       and (
         c.criado_por = auth.uid()
         or exists (
           select 1 from contrato_partes cp
            where cp.contrato_id = c.id
              and cp.conta_id = conta_atual()
              and cp.usuario_id = auth.uid()
         )
         or exists (
           select 1 from contrato_processos cpr
            where cpr.contrato_id = c.id
              and cpr.conta_id = conta_atual()
              and pode_ver_processo(cpr.processo_id)
         )
       )
  );
end $$;

revoke all on function public.pode_ver_contrato(uuid) from public;
grant execute on function public.pode_ver_contrato(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Substituição de políticas de RLS para contratos
-- ---------------------------------------------------------------------------
drop policy if exists contratos_ver on contratos;
create policy contratos_ver on contratos for select to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'ver')
    and (
      perfil_atual() = 'dono'
      or criado_por = auth.uid()
      or pode_ver_contrato(id)
    )
  );

drop policy if exists contratos_criar on contratos;
create policy contratos_criar on contratos for insert to authenticated
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'criar')
  );

drop policy if exists contratos_editar on contratos;
create policy contratos_editar on contratos for update to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and pode_ver_contrato(id)
  )
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and pode_ver_contrato(id)
  );

drop policy if exists contratos_excluir on contratos;
create policy contratos_excluir on contratos for delete to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'excluir')
    and pode_ver_contrato(id)
  );

-- ---------------------------------------------------------------------------
-- 5. Substituição de políticas de RLS para contrato_partes
-- ---------------------------------------------------------------------------
drop policy if exists contrato_partes_ver on contrato_partes;
create policy contrato_partes_ver on contrato_partes for select to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'ver')
    and pode_ver_contrato(contrato_id)
  );

drop policy if exists contrato_partes_criar on contrato_partes;
create policy contrato_partes_criar on contrato_partes for insert to authenticated
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'criar')
    and pode_ver_contrato(contrato_id)
  );

drop policy if exists contrato_partes_editar on contrato_partes;
create policy contrato_partes_editar on contrato_partes for update to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and pode_ver_contrato(contrato_id)
  )
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and pode_ver_contrato(contrato_id)
  );

drop policy if exists contrato_partes_excluir on contrato_partes;
create policy contrato_partes_excluir on contrato_partes for delete to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'excluir')
    and pode_ver_contrato(contrato_id)
  );

-- ---------------------------------------------------------------------------
-- 6. Substituição de políticas de RLS para contrato_processos
-- ---------------------------------------------------------------------------
drop policy if exists contrato_processos_ver on contrato_processos;
create policy contrato_processos_ver on contrato_processos for select to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'ver')
    and pode_ver_contrato(contrato_id)
    and pode_ver_processo(processo_id)
  );

drop policy if exists contrato_processos_criar on contrato_processos;
create policy contrato_processos_criar on contrato_processos for insert to authenticated
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'criar')
    and pode_ver_contrato(contrato_id)
    and pode_ver_processo(processo_id)
  );

drop policy if exists contrato_processos_editar on contrato_processos;
create policy contrato_processos_editar on contrato_processos for update to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and pode_ver_contrato(contrato_id)
    and pode_ver_processo(processo_id)
  )
  with check (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'editar')
    and pode_ver_contrato(contrato_id)
    and pode_ver_processo(processo_id)
  );

drop policy if exists contrato_processos_excluir on contrato_processos;
create policy contrato_processos_excluir on contrato_processos for delete to authenticated
  using (
    conta_id = conta_atual()
    and perfil_atual() in ('dono', 'advogado')
    and pode('contratos', 'excluir')
    and pode_ver_contrato(contrato_id)
    and pode_ver_processo(processo_id)
  );
