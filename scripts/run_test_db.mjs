import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function main() {
  const dbUrl = process.env.SUPABASE_DB_URL;
  let pg;

  if (dbUrl) {
    console.log('[test:db] Conectando ao banco remoto via SUPABASE_DB_URL...');
    try {
      const { Client } = await import('pg');
      const client = new Client({ connectionString: dbUrl });
      await client.connect();
      pg = {
        exec: async (sql) => { await client.query(sql); },
        query: async (sql, params) => client.query(sql, params),
        close: async () => client.end(),
        onNotice: (fn) => client.on('notice', fn)
      };
    } catch (err) {
      console.error('[test:db] Erro ao conectar ao banco remoto (pacote "pg" instalado?):', err.message);
      process.exit(1);
    }
  } else {
    console.log('[test:db] Executando em ambiente local PGlite (em memória)...');
    const pgliteInstance = new PGlite();
    pg = {
      exec: async (sql) => pgliteInstance.exec(sql),
      query: async (sql, params) => pgliteInstance.query(sql, params),
      close: async () => pgliteInstance.close(),
      onNotice: (fn) => pgliteInstance.onNotification?.(fn)
    };

    // Setup Supabase-like environment
    await pg.exec(`
      DO $$ BEGIN CREATE ROLE authenticated; EXCEPTION WHEN OTHERS THEN NULL; END $$;
      DO $$ BEGIN CREATE ROLE anon; EXCEPTION WHEN OTHERS THEN NULL; END $$;
      DO $$ BEGIN CREATE ROLE service_role; EXCEPTION WHEN OTHERS THEN NULL; END $$;
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
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated, anon, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated, anon, service_role;
      ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated, anon, service_role;
    `);

    // Aplica migrations em ordem
    const migrationsDir = 'supabase/migrations';
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`[test:db] Aplicando ${files.length} migrations...`);
    for (const f of files) {
      let sql = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
      sql = sql.replace('create extension if not exists pgcrypto;', '');
      await pg.exec(sql);
    }

    // Aplica seed
    console.log('[test:db] Aplicando seed.sql...');
    const seedSql = fs.readFileSync('supabase/seed.sql', 'utf8');
    await pg.exec(seedSql);
  }

  // Executa teste_isolamento_completo.sql
  console.log('[test:db] Executando supabase/tests/teste_isolamento_completo.sql...');
  let testSql = fs.readFileSync('supabase/tests/teste_isolamento_completo.sql', 'utf8');
  // Remove comandos meta do psql (ex: \set ON_ERROR_STOP on)
  testSql = testSql.replace(/^\\set\s+.*$/gm, '');

  try {
    await pg.exec('SET ROLE authenticated;');
    await pg.exec(testSql);
    console.log('[test:db] Sucesso! Todos os testes de isolamento passaram.');
  } catch (err) {
    console.error('\n[test:db] FALHA DETECTADA NO TESTE DE ISOLAMENTO:');
    console.error(err.message || err);
    if (err.detail) console.error('Detalhe:', err.detail);
    if (err.hint) console.error('Dica:', err.hint);
    if (err.where) console.error('Onde:', err.where);
    process.exit(1);
  } finally {
    if (pg.close) await pg.close();
  }
}

main();
