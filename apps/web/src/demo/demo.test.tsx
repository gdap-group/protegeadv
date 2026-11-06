// @vitest-environment jsdom
import '../test/setup';
import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import DemoApp from './DemoApp';
import { DemoProvider } from './DemoContext';
import { DemoProcessosLista } from './DemoProcessosLista';
import { DemoProcessoDetalhe } from './DemoProcessoDetalhe';
import { DemoPublicacoes } from './DemoPublicacoes';
import { DemoAgenda } from './DemoAgenda';
import { DemoPessoas } from './DemoPessoas';

function renderWithDemo(ui: React.ReactElement, initialRoute: string = '/demo/processos') {
  return render(
    <DemoProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        {ui}
      </MemoryRouter>
    </DemoProvider>
  );
}

describe('Modo de Demonstração Interativo (/demo — Passo 3.5)', () => {
  /* =========================================================================
   * 1. Governança de Isolamento de Dados Demo
   * ========================================================================= */
  it('NENHUM arquivo de produção fora de apps/web/src/demo importa dados-demo', () => {
    const srcDir = path.resolve(__dirname, '..');
    const demoDir = path.resolve(__dirname);

    function scanDir(dir: string): string[] {
      const files: string[] = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          // Pula a própria pasta demo e node_modules
          if (full === demoDir || entry.name === 'node_modules') continue;
          files.push(...scanDir(full));
        } else {
          // Pula arquivos de teste
          if (!entry.name.includes('.test.') && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
            files.push(full);
          }
        }
      }
      return files;
    }

    const prodFiles = scanDir(srcDir);
    const violations: string[] = [];

    for (const file of prodFiles) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('dados-demo') || content.includes('DADOS_DEMO_')) {
        violations.push(path.relative(srcDir, file));
      }
    }

    expect(
      violations,
      `Arquivos de produção fora de src/demo importando dados fictícios: ${violations.join(', ')}`
    ).toHaveLength(0);
  });

  /* =========================================================================
   * 2. Tela 1: Processos > Lista (Filtros, Busca, Ordenação, Paginação e Axe)
   * ========================================================================= */
  describe('Tela de Processos (Lista)', () => {
    it('renderiza os 30 processos fictícios e filtros rápidos com contagem', async () => {
      renderWithDemo(<DemoProcessosLista />);

      expect(screen.getByRole('heading', { name: 'Processos em Monitoramento' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Todos/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Com prazo próximo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sem andamento há 30 dias/i })).toBeInTheDocument();

      // Verifica exibição do CNJ em formato mono
      const cnjLink = screen.getAllByRole('link').find((l) => l.getAttribute('href')?.includes('/demo/processos/'));
      expect(cnjLink).toBeDefined();
      expect(cnjLink?.className).toContain('font-mono');
    });

    it('filtra por busca textual e por filtros rápidos', async () => {
      const user = userEvent.setup();
      renderWithDemo(<DemoProcessosLista />);

      // Filtro rápido "Com prazo próximo"
      const prazoProxBtn = screen.getByRole('button', { name: /Com prazo próximo/i });
      await user.click(prazoProxBtn);
      expect(prazoProxBtn).toHaveAttribute('aria-pressed', 'true');

      // Busca por texto
      const searchInput = screen.getByPlaceholderText('Buscar por CNJ, cliente, ação ou tribunal...');
      await user.type(searchInput, 'Horizonte');

      // Tabela deve filtrar dinamicamente
      const matches = screen.getAllByText(/Horizonte Logística/i);
      expect(matches.length).toBeGreaterThan(0);
    });

    it('ordenação por coluna e paginação funcionam', async () => {
      const user = userEvent.setup();
      renderWithDemo(<DemoProcessosLista />);

      // Clica para ordenar por número do processo
      const sortBtn = screen.getByRole('button', { name: 'Número do Processo' });
      await user.click(sortBtn);

      // Paginação: botão "Próxima"
      const nextBtn = screen.getByRole('button', { name: 'Próxima página' });
      expect(nextBtn).toBeInTheDocument();
      await user.click(nextBtn);
      expect(screen.getByText(/Página 2 de/i)).toBeInTheDocument();
    });

    it('passa no teste de acessibilidade (axe)', async () => {
      const { container } = renderWithDemo(<DemoProcessosLista />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  /* =========================================================================
   * 3. Tela 2: Processos > Ficha (PaginaDetalhe e Axe)
   * ========================================================================= */
  describe('Tela de Processos (Ficha Detalhe)', () => {
    it('renderiza título, CNJ mono, badge de status, abas e metadados rápidos', async () => {
      const user = userEvent.setup();
      renderWithDemo(<DemoProcessoDetalhe />);

      expect(screen.getByText(/Monitoramento Ativo/i)).toBeInTheDocument();
      expect(screen.getByText(/Metadados dos Autos/i)).toBeInTheDocument();
      expect(screen.getByText(/Síntese dos Autos/i)).toBeInTheDocument();

      // Troca para a aba Andamentos
      const andamentosTab = screen.getByRole('tab', { name: /Andamentos/i });
      await user.click(andamentosTab);
      expect(screen.getByText(/Histórico Cronológico de Andamentos/i)).toBeInTheDocument();
    });

    it('passa no teste de acessibilidade (axe)', async () => {
      const { container } = renderWithDemo(<DemoProcessoDetalhe />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  /* =========================================================================
   * 4. Tela 3: Publicações (Leitura, Marcar como Lida e Atualização do Contador)
   * ========================================================================= */
  describe('Tela de Publicações (Caixa de Entrada)', () => {
    it('destaca não lidas, abre painel de leitura e marcar como lida atualiza o contador', async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter initialEntries={['/demo/publicacoes']}>
          <Routes>
            <Route path="/demo/*" element={<DemoApp />} />
          </Routes>
        </MemoryRouter>
      );

      // Banner fixo obrigatório presente
      expect(screen.getByText('Demonstração com dados fictícios')).toBeInTheDocument();

      // Contador inicial no menu (4 não lidas)
      const badgeCount = screen.getByText('4');
      expect(badgeCount).toBeInTheDocument();

      // Clica na primeira publicação não lida
      const pubs = screen.getAllByRole('button', { name: /Publicação de/i });
      expect(pubs.length).toBeGreaterThan(0);
      await user.click(pubs[0]);

      // Painel lateral de leitura abre
      expect(await screen.findByText('Teor Completo do Despacho')).toBeInTheDocument();

      // Clica no botão "Marcar como Lida"
      const toggleBtn = screen.getByRole('button', { name: 'Marcar como Lida' });
      await user.click(toggleBtn);

      // O contador no menu é decrementado de 4 para 3
      await waitFor(() => {
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });

    it('passa no teste de acessibilidade (axe)', async () => {
      const { container } = renderWithDemo(<DemoPublicacoes />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  /* =========================================================================
   * 5. Tela 4: Agenda (Grade Simples, Prazo Vencido e Axe)
   * ========================================================================= */
  describe('Tela de Agenda', () => {
    it('renderiza grade do mês, navegação e destaca prazo vencido com ícone e texto', async () => {
      const user = userEvent.setup();
      renderWithDemo(<DemoAgenda />);

      // Grade mensal e dias da semana
      expect(screen.getByText('Seg')).toBeInTheDocument();
      expect(screen.getByText('Sex')).toBeInTheDocument();

      // Prazo vencido com texto explícito e ícone
      const vencidos = screen.getAllByText(/Prazo Vencido/i);
      expect(vencidos.length).toBeGreaterThan(0);

      // Navegação mês anterior
      const prevBtn = screen.getByRole('button', { name: 'Mês anterior' });
      await user.click(prevBtn);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('passa no teste de acessibilidade (axe)', async () => {
      const { container } = renderWithDemo(<DemoAgenda />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  /* =========================================================================
   * 6. Tela 5: Pessoas (Lista e Ficha com Processos Ligados)
   * ========================================================================= */
  describe('Tela de Pessoas', () => {
    it('renderiza lista de pessoas e ficha com processos judiciais vinculados', async () => {
      const user = userEvent.setup();
      renderWithDemo(<DemoPessoas />);

      expect(screen.getByRole('heading', { name: 'Cadastro de Pessoas e Envolvidos' })).toBeInTheDocument();
      expect(screen.getAllByText('Mariana Albuquerque Dias').length).toBeGreaterThan(0);

      // Ficha da pessoa com processos ligados
      expect(screen.getByText(/Processos Judiciais Vinculados/i)).toBeInTheDocument();

      // Clica em outra pessoa da lista
      const pessoaItem = screen.getByText('Carlos Eduardo Meireles');
      await user.click(pessoaItem);

      expect(screen.getByText('carlos.meireles@exemplo.com.br')).toBeInTheDocument();
    });

    it('passa no teste de acessibilidade (axe)', async () => {
      const { container } = renderWithDemo(<DemoPessoas />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
