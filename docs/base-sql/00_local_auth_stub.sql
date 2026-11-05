-- 00_local_auth_stub.sql
-- SOMENTE PARA TESTE LOCAL (Postgres comum, fora do Supabase).
-- Reproduz o mínimo da autenticação do Supabase que o núcleo usa:
--   schema auth, tabela auth.users, função auth.uid() e os papéis anon/authenticated.
-- NÃO aplicar no Supabase: lá isso já existe.

create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key,
  email text
);

-- No Supabase, auth.uid() lê o id do usuário logado do token.
-- Aqui lemos de uma configuração de sessão para simular o login nos testes.
create or replace function auth.uid() returns uuid
language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end $$;

grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;
