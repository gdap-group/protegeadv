import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function verify() {
  const pg = new PGlite();
  await pg.exec(`
    DO $$ BEGIN CREATE ROLE authenticated; EXCEPTION WHEN OTHERS THEN NULL; END $$;
    DO $$ BEGIN CREATE ROLE anon; EXCEPTION WHEN OTHERS THEN NULL; END $$;
    DO $$ BEGIN CREATE ROLE service_role; EXCEPTION WHEN OTHERS THEN NULL; END $$;
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE TABLE IF NOT EXISTS auth.users (id uuid PRIMARY KEY DEFAULT gen_random_uuid());
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    CREATE OR REPLACE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), 'anon')::text $$;
  `);

  const migrations = fs.readdirSync('supabase/migrations').filter(f => f.endsWith('.sql')).sort();
  for (const m of migrations) {
    console.log('Aplicando', m);
    let sql = fs.readFileSync(path.join('supabase/migrations', m), 'utf8');
    sql = sql.replace(/create extension if not exists pgcrypto;/g, '');
    await pg.exec(sql);
  }

  const tablesRes = await pg.query(`
    SELECT c.relname as table_name, c.relrowsecurity as rls_enabled, count(p.polname)::int as policy_count
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    LEFT JOIN pg_policy p ON p.polrelid = c.oid
    WHERE n.nspname = 'public' 
      AND c.relkind = 'r'
    GROUP BY c.relname, c.relrowsecurity
    ORDER BY c.relname;
  `);

  console.log('Total de tabelas criadas:', tablesRes.rows.length);
  console.table(tablesRes.rows);

  const semRls = tablesRes.rows.filter(r => !r.rls_enabled);
  const semPol = tablesRes.rows.filter(r => r.policy_count === 0);

  console.log('Tabelas com RLS desativada:', semRls.length);
  console.log('Tabelas sem políticas:', semPol.length);
  if (semRls.length > 0 || semPol.length > 0) {
    throw new Error('Há tabelas sem RLS ou sem políticas!');
  }

  return tablesRes.rows;
}

verify()
  .then(() => console.log('Todas as migrations 0001 a 0009 aplicadas com sucesso!'))
  .catch(err => {
    console.error('Erro na migration:', err.message);
    process.exit(1);
  });
