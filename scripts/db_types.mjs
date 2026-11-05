import { execSync } from 'child_process';
import fs from 'fs';

try {
  const types = execSync('supabase gen types typescript --local', {
    stdio: ['pipe', 'pipe', 'ignore'],
    encoding: 'utf8'
  });
  if (types && types.includes('export type Database')) {
    fs.writeFileSync('packages/shared/src/database.types.ts', types, 'utf8');
    console.log('Tipos TypeScript gerados com sucesso via Supabase CLI local.');
    process.exit(0);
  }
} catch {
  // Docker local não está em execução; executa gerador com PGlite embutido
}

await import('./generate_types.mjs');
