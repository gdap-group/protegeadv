import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(__dirname, '.');
const THEME_FILE = 'theme.css';

// Cores canônicas exigidas pelo sistema
const EXPECTED_TOKENS = [
  { name: '--color-bg', value: '#0A0A0F' },
  { name: '--color-surface', value: '#12121A' },
  { name: '--color-elevated', value: '#1A1A26' },
  { name: '--color-border', value: 'rgba(255, 255, 255, 0.08)' },
  { name: '--color-primary', value: '#8B5CF6' },
  { name: '--color-primary-hover', value: '#7C3AED' },
  { name: '--color-glow', value: '#A78BFA' },
  { name: '--color-gradient-from', value: '#8B5CF6' },
  { name: '--color-gradient-to', value: '#6366F1' },
  { name: '--color-text', value: '#F4F4F8' },
  { name: '--color-muted', value: '#9CA3AF' },
  { name: '--color-success', value: '#34D399' },
  { name: '--color-warning', value: '#FBBF24' },
  { name: '--color-danger', value: '#F87171' },
];

function getAllFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

describe('Governança de Cores e Tokens do Tema', () => {
  it('o arquivo theme.css define rigorosamente as 13 cores canônicas', () => {
    const themePath = path.join(SRC_DIR, THEME_FILE);
    expect(fs.existsSync(themePath)).toBe(true);
    const content = fs.readFileSync(themePath, 'utf8');

    for (const token of EXPECTED_TOKENS) {
      expect(content).toContain(token.name);
      expect(content.toLowerCase()).toContain(token.value.toLowerCase());
    }
  });

  it('NENHUMA cor hexadecimal ou rgb() existe fora do arquivo theme.css em apps/web/src', () => {
    const allFiles = getAllFiles(SRC_DIR);
    const textExtensions = ['.ts', '.tsx', '.css', '.js', '.jsx', '.html'];
    
    // Expressões regulares construídas dinamicamente para detectar hex e rgb literals
    const hexRegex = new RegExp('#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b', 'g');
    const rgbRegex = new RegExp('rgba?\\s*\\([^)]*\\)', 'gi');

    const violations: { file: string; line: number; match: string; text: string }[] = [];

    for (const filePath of allFiles) {
      const ext = path.extname(filePath).toLowerCase();
      if (!textExtensions.includes(ext)) continue;

      const relativePath = path.relative(SRC_DIR, filePath).replace(/\\/g, '/');

      // O arquivo único do tema e o próprio teste são ignorados da varredura
      if (relativePath === THEME_FILE || relativePath === 'theme.test.ts') {
        continue;
      }

      const lines = fs.readFileSync(filePath, 'utf8').split('\n');
      lines.forEach((lineText, index) => {
        // Ignora comentários de linha única ou URLs
        const cleaned = lineText.trim();
        if (cleaned.startsWith('//') || cleaned.startsWith('/*')) return;

        const hexMatches = cleaned.match(hexRegex);
        if (hexMatches) {
          for (const m of hexMatches) {
            violations.push({ file: relativePath, line: index + 1, match: m, text: cleaned });
          }
        }

        const rgbMatches = cleaned.match(rgbRegex);
        if (rgbMatches) {
          for (const m of rgbMatches) {
            violations.push({ file: relativePath, line: index + 1, match: m, text: cleaned });
          }
        }
      });
    }

    if (violations.length > 0) {
      const report = violations
        .map((v) => `  - ${v.file}:${v.line} -> "${v.match}" na linha: ${v.text}`)
        .join('\n');
      expect.fail(
        `Foram encontradas cores literais (hex ou rgb) fora de src/${THEME_FILE}:\n${report}\n` +
          'Todas as cores devem vir exclusivamente de var(--color-*) definidas em theme.css.'
      );
    }

    expect(violations).toHaveLength(0);
  });
});

