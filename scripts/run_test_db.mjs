import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

function getDbUrl() {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;
  if (fs.existsSync('.env')) {
    const content = fs.readFileSync('.env', 'utf8');
    const match = content.match(/^SUPABASE_DB_URL\s*=\s*(.*)$/m);
    if (match) return match[1].trim().replace(/^['"]|['"]$/g, '');
  }
  return null;
}

async function main() {
  const isRemote = process.argv.includes('--remote');

  if (isRemote) {
    console.log('[test:db:remoto] Iniciando teste de isolamento no Supabase remoto...');
    const dbUrl = getDbUrl();

    if (!dbUrl || !dbUrl.includes('dvqrlgoqfsxrcjkfytfj')) {
      console.error('[test:db:remoto] ABORTADO: SUPABASE_DB_URL ausente ou não contém o project-ref "dvqrlgoqfsxrcjkfytfj".');
      process.exit(1);
    }

    let client;
    try {
      const { Client } = await import('pg');
      client = new Client({ connectionString: dbUrl });
      await client.connect();
    } catch (err) {
      console.error('[test:db:remoto] Erro ao conectar ao banco remoto:', err.message);
      process.exit(1);
    }

    client.on('notice', (notice) => {
      console.log(notice.message);
    });

    // 1. Checagem prévia somente de leitura
    console.log('[test:db:remoto] Executando checagem prévia...');
    const tablesRes = await client.query(`
      select count(*)::int as c from information_schema.tables
      where table_schema = 'public' and table_type = 'BASE TABLE'
    `);
    const contasRes = await client.query('select count(*)::int as c from public.contas');

    const totalTables = tablesRes.rows[0].c;
    const totalContas = contasRes.rows[0].c;

    if (totalTables !== 39 || totalContas !== 2) {
      console.error(`[test:db:remoto] ABORTADO: Checagem prévia falhou! Tabelas em public: ${totalTables} (esperado 39), Linhas em contas: ${totalContas} (esperado 2).`);
      await client.end();
      process.exit(1);
    }

    console.log(`[test:db:remoto] Checagem prévia OK: ${totalTables} tabelas em public e ${totalContas} contas.`);
    console.log('[test:db:remoto] Executando supabase/tests/teste_isolamento_completo.sql...');

    let testSql = fs.readFileSync('supabase/tests/teste_isolamento_completo.sql', 'utf8');
    testSql = testSql.replace(/^\\set\s+.*$/gm, '');

    try {
      await client.query('SET ROLE authenticated;');
      await client.query(testSql);
      console.log('[test:db:remoto] Sucesso! Todos os testes de isolamento passaram no banco remoto.');
    } catch (err) {
      console.error('\n[test:db:remoto] FALHA DETECTADA NO TESTE DE ISOLAMENTO:');
      console.error(err.message || err);
      if (err.detail) console.error('Detalhe:', err.detail);
      if (err.hint) console.error('Dica:', err.hint);
      if (err.where) console.error('Onde:', err.where);
      try {
        await client.query('ROLLBACK;');
      } catch {
        // ignora se já reverteu
      }
      process.exit(1);
    } finally {
      await client.end();
    }
    return;
  }

  // Modo local (PGlite)
  console.log('[test:db] Executando em ambiente local PGlite (em memória)...');
  const pgliteInstance = new PGlite();
  const pg = {
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

  // Executa teste_isolamento_completo.sql
  console.log('[test:db] Executando supabase/tests/teste_isolamento_completo.sql...');
  let testSql = fs.readFileSync('supabase/tests/teste_isolamento_completo.sql', 'utf8');
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
