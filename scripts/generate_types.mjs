import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function generate() {
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

  const migrations = fs.readdirSync('supabase/migrations')
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const m of migrations) {
    let sql = fs.readFileSync(path.join('supabase/migrations', m), 'utf8');
    sql = sql.replace('create extension if not exists pgcrypto;', '');
    await pg.exec(sql);
  }

  // 1. Fetch enums
  const enumsRes = await pg.query(`
    SELECT t.typname as name, array_agg(e.enumlabel ORDER BY e.enumsortorder) as values
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
    GROUP BY t.typname
    ORDER BY t.typname;
  `);

  const enumsMap = new Map();
  for (const r of enumsRes.rows) {
    enumsMap.set(r.name, r.values);
  }

  // 2. Fetch tables
  const tablesRes = await pg.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `);
  const tables = tablesRes.rows.map(r => r.table_name);

  // 3. Fetch columns
  const colsRes = await pg.query(`
    SELECT 
      table_name,
      column_name,
      data_type,
      udt_name,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `);

  // 4. Fetch foreign key relationships
  const fkRes = await pg.query(`
    SELECT
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';
  `);

  const fksByTable = new Map();
  for (const r of fkRes.rows) {
    if (!fksByTable.has(r.table_name)) fksByTable.set(r.table_name, []);
    fksByTable.get(r.table_name).push(r);
  }

  function mapPostgresTypeToTs(dataType, udtName) {
    if (enumsMap.has(udtName)) {
      return `Database["public"]["Enums"]["${udtName}"]`;
    }
    if (udtName.startsWith('_')) {
      const elemUdt = udtName.substring(1);
      if (enumsMap.has(elemUdt)) {
        return `Database["public"]["Enums"]["${elemUdt}"][]`;
      }
      if (['text', 'varchar', 'bpchar'].includes(elemUdt)) return 'string[]';
      if (['int2', 'int4', 'int8', 'float4', 'float8', 'numeric'].includes(elemUdt)) return 'number[]';
      return 'string[]';
    }
    switch (dataType) {
      case 'uuid':
      case 'text':
      case 'character varying':
      case 'varchar':
      case 'date':
      case 'timestamp with time zone':
      case 'timestamp without time zone':
      case 'time':
      case 'time with time zone':
      case 'inet':
      case 'cidr':
        return 'string';
      case 'smallint':
      case 'integer':
      case 'bigint':
      case 'decimal':
      case 'numeric':
      case 'real':
      case 'double precision':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'json':
      case 'jsonb':
        return 'Json';
      case 'ARRAY':
        return 'string[]';
      default:
        return 'string';
    }
  }

  let code = `export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
`;

  for (const table of tables) {
    const cols = colsRes.rows.filter(c => c.table_name === table);
    const fks = fksByTable.get(table) || [];

    code += `      ${table}: {\n`;

    // Row
    code += `        Row: {\n`;
    for (const c of cols) {
      const tsType = mapPostgresTypeToTs(c.data_type, c.udt_name);
      const nullable = c.is_nullable === 'YES' ? ' | null' : '';
      code += `          ${c.column_name}: ${tsType}${nullable}\n`;
    }
    code += `        }\n`;

    // Insert
    code += `        Insert: {\n`;
    for (const c of cols) {
      const tsType = mapPostgresTypeToTs(c.data_type, c.udt_name);
      const isOptional = c.column_default !== null || c.is_nullable === 'YES';
      const opt = isOptional ? '?:' : ':';
      const nullable = c.is_nullable === 'YES' ? ' | null' : '';
      code += `          ${c.column_name}${opt} ${tsType}${nullable}\n`;
    }
    code += `        }\n`;

    // Update
    code += `        Update: {\n`;
    for (const c of cols) {
      const tsType = mapPostgresTypeToTs(c.data_type, c.udt_name);
      const nullable = c.is_nullable === 'YES' ? ' | null' : '';
      code += `          ${c.column_name}?: ${tsType}${nullable}\n`;
    }
    code += `        }\n`;

    // Relationships
    code += `        Relationships: [\n`;
    for (const fk of fks) {
      code += `          {\n`;
      code += `            foreignKeyName: "${table}_${fk.column_name}_fkey"\n`;
      code += `            columns: ["${fk.column_name}"]\n`;
      code += `            isOneToOne: false\n`;
      code += `            referencedRelation: "${fk.foreign_table_name}"\n`;
      code += `            referencedColumns: ["${fk.foreign_column_name}"]\n`;
      code += `          },\n`;
    }
    code += `        ]\n`;

    code += `      }\n`;
  }

  code += `    }\n`;
  code += `    Views: {\n      [_ in never]: never\n    }\n`;
  code += `    Functions: {\n`;
  code += `      conta_atual: {\n        Args: Record<PropertyKey, never>\n        Returns: string\n      }\n`;
  code += `      perfil_atual: {\n        Args: Record<PropertyKey, never>\n        Returns: Database["public"]["Enums"]["perfil_usuario"]\n      }\n`;
  code += `      pode: {\n        Args: {\n          modulo_nome: Database["public"]["Enums"]["modulo_sistema"]\n          acao: string\n        }\n        Returns: boolean\n      }\n`;
  code += `      pode_ver_processo: {\n        Args: {\n          p_processo_id: string\n        }\n        Returns: boolean\n      }\n`;
  code += `      expurgar_registros_excluidos: {\n        Args: Record<PropertyKey, never>\n        Returns: {\n          tabela: string\n          registros_excluidos: number\n        }[]\n      }\n`;
  code += `    }\n`;
  code += `    Enums: {\n`;

  for (const [enumName, values] of enumsMap.entries()) {
    code += `      ${enumName}: ${values.map(v => `"${v}"`).join(' | ')}\n`;
  }

  code += `    }\n`;
  code += `    CompositeTypes: {\n      [_ in never]: never\n    }\n`;
  code += `  }\n`;
  code += `}\n\n`;

  // Helper types like Supabase CLI generates
  code += `type PublicSchema = Database[Extract<keyof Database, "public">]\n\n`;
  code += `export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never\n\n`;

  code += `export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never\n\n`;

  code += `export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never\n\n`;

  code += `export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never\n`;

  fs.writeFileSync('packages/shared/src/database.types.ts', code, 'utf8');
  console.log('Successfully generated packages/shared/src/database.types.ts!');
}

generate().catch(err => {
  console.error('Generation error:', err);
  process.exit(1);
});
