import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function testSeed() {
  const pg = new PGlite();

  // Setup roles and auth schema for Supabase environment
  await pg.exec(`
    DO $$ BEGIN
      CREATE ROLE authenticated;
    EXCEPTION WHEN OTHERS THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE ROLE anon;
    EXCEPTION WHEN OTHERS THEN NULL;
    END $$;
    DO $$ BEGIN
      CREATE ROLE service_role;
    EXCEPTION WHEN OTHERS THEN NULL;
    END $$;
    CREATE SCHEMA IF NOT EXISTS auth;
    CREATE TABLE IF NOT EXISTS auth.users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      instance_id uuid,
      aud text,
      role text,
      email text UNIQUE,
      encrypted_password text,
      email_confirmed_at timestamptz,
      raw_app_meta_data jsonb,
      raw_user_meta_data jsonb DEFAULT '{}'::jsonb,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz
    );
    CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    CREATE OR REPLACE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claim.role', true), ''), 'anon')::text $$;
  `);

  const migrations = [
    '0001_nucleo.sql',
    '0002_empresas_etiquetas_campos.sql',
    '0003_partes_andamentos_buscas_leituras.sql',
    '0004_publicacoes_distribuicoes_termos.sql',
    '0005_ged_modelos_avisos.sql',
    '0006_auditoria_consultas_expurgo.sql'
  ];

  for (const m of migrations) {
    let sql = fs.readFileSync(path.join('supabase/migrations', m), 'utf8');
    sql = sql.replace('create extension if not exists pgcrypto;', '');
    await pg.exec(sql);
  }

  const seedSql = fs.readFileSync('supabase/seed.sql', 'utf8');
  await pg.exec(seedSql);

  const tablesRes = await pg.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);

  console.log('Total tables in public schema:', tablesRes.rows.length);
  const counts = [];
  for (const r of tablesRes.rows) {
    const t = r.table_name;
    const countRes = await pg.query(`SELECT count(*)::int as count FROM public.${t}`);
    counts.push({ table: t, count: countRes.rows[0].count });
  }

  console.table(counts);

  // Also check auth.users
  const authCount = await pg.query(`SELECT count(*)::int as count FROM auth.users`);
  console.log('auth.users count:', authCount.rows[0].count);
}

testSeed().catch(err => {
  console.error('ERROR message:', err.message);
  console.error('ERROR position/detail:', err);
  process.exit(1);
});
