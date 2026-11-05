// @vitest-environment jsdom
import '../../test/setup';
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router-dom';
import { z } from 'zod';
import { type ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, FileText, Clock } from 'lucide-react';
import { PaginaLista } from './PaginaLista';
import { PaginaDetalhe } from './PaginaDetalhe';
import {
  FormularioEmPainel,
  FormFieldItem,
  FormFieldLabel,
  FormFieldErrorMessage,
} from './FormularioEmPainel';
import { Input } from '../ui/input';

interface TestProcesso {
  id: string;
  cnj: string;
  cliente: string;
  status: string;
}

const mockColumns: ColumnDef<TestProcesso, unknown>[] = [
  { accessorKey: 'cnj', header: 'Número CNJ' },
  { accessorKey: 'cliente', header: 'Cliente' },
  { accessorKey: 'status', header: 'Situação' },
];

const mockData: TestProcesso[] = [
  {
    id: '1',
    cnj: '0001234-56.2024.8.13.0024',
    cliente: 'Indústria Alfa S.A.',
    status: 'Ativo',
  },
  {
    id: '2',
    cnj: '0009876-54.2024.8.13.0024',
    cliente: 'Comércio Beta Ltda',
    status: 'Suspenso',
  },
];

describe('Modelos de Página Reutilizáveis (Patterns — Passo 3.4)', () => {
  /* =========================================================================
   * 1. PaginaLista
   * ========================================================================= */
  describe('PaginaLista', () => {
    it('renderiza título, busca, filtros rápidos, botão de ação e dados na tabela', () => {
      const onSearch = vi.fn();
      const onFilter = vi.fn();
      const onAction = vi.fn();

      render(
        <MemoryRouter>
          <PaginaLista
            title="Processos em Monitoramento"
            description="Visão geral dos processos ativos"
            primaryAction={{ label: 'Novo Processo', onClick: onAction }}
            searchValue=""
            onSearchChange={onSearch}
            quickFilters={[
              { id: 'todos', label: 'Todos', count: 2 },
              { id: 'ativos', label: 'Ativos', count: 1 },
            ]}
            activeQuickFilter="todos"
            onQuickFilterChange={onFilter}
            columns={mockColumns}
            data={mockData}
          />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: 'Processos em Monitoramento' })).toBeInTheDocument();
      expect(screen.getByText('Visão geral dos processos ativos')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Novo Processo' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar registros...')).toBeInTheDocument();

      // Linhas da tabela
      expect(screen.getByText('0001234-56.2024.8.13.0024')).toBeInTheDocument();
      expect(screen.getByText('Indústria Alfa S.A.')).toBeInTheDocument();
      expect(screen.getByText('Comércio Beta Ltda')).toBeInTheDocument();
    });

    it('renderiza estado de carregamento com Skeletons acessíveis', () => {
      render(
        <MemoryRouter>
          <PaginaLista
            title="Processos em Monitoramento"
            isLoading={true}
            columns={mockColumns}
            data={mockData}
          />
        </MemoryRouter>
      );

      const statusEl = screen.getByRole('status', { name: 'Carregando dados da tabela' });
      expect(statusEl).toBeInTheDocument();
      expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
    });

    it('renderiza estado vazio com EmptyState e botão de ação', async () => {
      const user = userEvent.setup();
      const onEmptyAction = vi.fn();

      render(
        <MemoryRouter>
          <PaginaLista
            title="Processos em Monitoramento"
            columns={mockColumns}
            data={[]}
            emptyTitle="Nenhum processo encontrado"
            emptyDescription="Cadastre o primeiro processo para começar."
            emptyAction={{ label: 'Criar Processo', onClick: onEmptyAction }}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Nenhum processo encontrado')).toBeInTheDocument();
      expect(screen.getByText('Cadastre o primeiro processo para começar.')).toBeInTheDocument();

      const btn = screen.getByRole('button', { name: 'Criar Processo' });
      await user.click(btn);
      expect(onEmptyAction).toHaveBeenCalledTimes(1);
    });

    it('renderiza estado de erro com mensagem em português e botão Tentar de novo', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(
        <MemoryRouter>
          <PaginaLista
            title="Processos em Monitoramento"
            isError={true}
            errorMessage="Falha de conexão com o tribunal."
            onRetry={onRetry}
            columns={mockColumns}
            data={[]}
          />
        </MemoryRouter>
      );

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(screen.getByText('Falha ao carregar registros')).toBeInTheDocument();
      expect(screen.getByText('Falha de conexão com o tribunal.')).toBeInTheDocument();

      const retryBtn = screen.getByRole('button', { name: /Tentar de novo/i });
      await user.click(retryBtn);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('não possui violações de acessibilidade (axe) no estado com dados e no estado vazio', async () => {
      const { container: c1 } = render(
        <MemoryRouter>
          <PaginaLista
            title="Processos em Monitoramento"
            columns={mockColumns}
            data={mockData}
          />
        </MemoryRouter>
      );
      expect(await axe(c1)).toHaveNoViolations();

      const { container: c2 } = render(
        <MemoryRouter>
          <PaginaLista
            title="Processos em Monitoramento"
            columns={mockColumns}
            data={[]}
          />
        </MemoryRouter>
      );
      expect(await axe(c2)).toHaveNoViolations();
    });
  });

  /* =========================================================================
   * 2. PaginaDetalhe
   * ========================================================================= */
  describe('PaginaDetalhe', () => {
    it('renderiza cabeçalho, CNJ em fonte mono, badge de status, abas e card lateral', async () => {
      const user = userEvent.setup();

      render(
        <MemoryRouter>
          <PaginaDetalhe
            title="Ação Ordinária de Cobrança"
            codigoMono="0001234-56.2024.8.13.0024"
            status={{
              label: 'Ativo',
              variant: 'success',
              icon: CheckCircle2,
            }}
            breadcrumbs={[
              { label: 'Processos', href: '/processos' },
              { label: 'Detalhe' },
            ]}
            tabs={[
              {
                id: 'resumo',
                label: 'Resumo',
                icon: FileText,
                content: <div>Conteúdo Aba Resumo</div>,
              },
              {
                id: 'andamentos',
                label: 'Andamentos',
                count: 14,
                icon: Clock,
                content: <div>Conteúdo Aba Andamentos</div>,
              },
            ]}
            sideTitle="Metadados Rápidos"
            sideItems={[
              { label: 'Cliente', value: 'Empresa XPTO Ltda' },
              { label: 'Advogado', value: 'Dr. Roberto Santos' },
            ]}
          />
        </MemoryRouter>
      );

      // Título e código mono
      expect(screen.getByRole('heading', { name: 'Ação Ordinária de Cobrança' })).toBeInTheDocument();
      const monoEl = screen.getByText('0001234-56.2024.8.13.0024');
      expect(monoEl).toBeInTheDocument();
      expect(monoEl.className).toContain('font-mono');

      // Status Badge
      expect(screen.getByText('Ativo')).toBeInTheDocument();

      // Card Lateral
      expect(screen.getByText('Metadados Rápidos')).toBeInTheDocument();
      expect(screen.getByText('Empresa XPTO Ltda')).toBeInTheDocument();
      expect(screen.getByText('Dr. Roberto Santos')).toBeInTheDocument();

      // Abas
      expect(screen.getByText('Conteúdo Aba Resumo')).toBeInTheDocument();
      const andamentosTab = screen.getByRole('tab', { name: /Andamentos/i });
      expect(andamentosTab).toBeInTheDocument();

      // Troca de aba
      await user.click(andamentosTab);
      expect(screen.getByText('Conteúdo Aba Andamentos')).toBeInTheDocument();
    });

    it('não possui violações de acessibilidade (axe)', async () => {
      const { container } = render(
        <MemoryRouter>
          <PaginaDetalhe
            title="Ação Ordinária de Cobrança"
            codigoMono="0001234-56.2024.8.13.0024"
            status={{ label: 'Ativo', variant: 'success' }}
            tabs={[
              {
                id: 'resumo',
                label: 'Resumo',
                content: <div>Conteúdo do Resumo</div>,
              },
            ]}
            sideItems={[{ label: 'Cliente', value: 'Empresa XPTO Ltda' }]}
          />
        </MemoryRouter>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  /* =========================================================================
   * 3. FormularioEmPainel
   * ========================================================================= */
  describe('FormularioEmPainel', () => {
    const testSchema = z.object({
      nome: z.string().min(1),
      email: z.string().email(),
    });
    type TestForm = z.infer<typeof testSchema>;

    function TestComponent({
      onSubmit,
      onOpenChange,
    }: {
      onSubmit?: (data: TestForm) => Promise<void> | void;
      onOpenChange?: (open: boolean) => void;
    }) {
      const [open, setOpen] = React.useState(true);
      const handleOpenChange = (v: boolean) => {
        setOpen(v);
        onOpenChange?.(v);
      };

      return (
        <FormularioEmPainel<TestForm>
          open={open}
          onOpenChange={handleOpenChange}
          title="Cadastro de Cliente"
          description="Preencha os dados do cliente"
          schema={testSchema}
          defaultValues={{ nome: '', email: '' }}
          onSubmit={onSubmit ?? vi.fn()}
        >
          {(form) => (
            <>
              <FormFieldItem>
                <FormFieldLabel htmlFor="nome" required>
                  Nome Completo
                </FormFieldLabel>
                <Input
                  id="nome"
                  {...form.register('nome')}
                  aria-invalid={!!form.formState.errors.nome}
                />
                <FormFieldErrorMessage>
                  {form.formState.errors.nome?.message}
                </FormFieldErrorMessage>
              </FormFieldItem>

              <FormFieldItem>
                <FormFieldLabel htmlFor="email" required>
                  E-mail
                </FormFieldLabel>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  aria-invalid={!!form.formState.errors.email}
                />
                <FormFieldErrorMessage>
                  {form.formState.errors.email?.message}
                </FormFieldErrorMessage>
              </FormFieldItem>
            </>
          )}
        </FormularioEmPainel>
      );
    }

    it('valida campo obrigatório e e-mail inválido exibindo mensagens em português', async () => {
      const user = userEvent.setup();
      render(<TestComponent />);

      // Tenta submeter formulário em branco
      const submitBtn = screen.getByRole('button', { name: 'Salvar' });
      await user.click(submitBtn);

      // Mensagens traduzidas pelo zod-pt
      expect(await screen.findByText('Campo obrigatório')).toBeInTheDocument();
      expect(await screen.findByText('E-mail inválido')).toBeInTheDocument();

      // Preenche nome e e-mail inválido
      const nomeInput = screen.getByLabelText(/Nome Completo/i);
      const emailInput = screen.getByLabelText(/E-mail/i);

      await user.type(nomeInput, 'Mariana Silva');
      await user.clear(emailInput);
      await user.type(emailInput, 'emailinvalido');
      await user.tab(); // dispara onBlur

      await waitFor(() => {
        expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
        expect(screen.queryByText('Campo obrigatório')).not.toBeInTheDocument();
      });
    });

    it('submete com sucesso com dados válidos', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<TestComponent onSubmit={onSubmit} />);

      const nomeInput = screen.getByLabelText(/Nome Completo/i);
      const emailInput = screen.getByLabelText(/E-mail/i);

      await user.type(nomeInput, 'Mariana Silva');
      await user.type(emailInput, 'mariana@exemplo.com');

      const submitBtn = screen.getByRole('button', { name: 'Salvar' });
      await user.click(submitBtn);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          nome: 'Mariana Silva',
          email: 'mariana@exemplo.com',
        });
      });
    });

    it('alerta de alterações não salvas ao tentar cancelar com formulário sujo (isDirty)', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<TestComponent onOpenChange={onOpenChange} />);

      const nomeInput = screen.getByLabelText(/Nome Completo/i);
      await user.type(nomeInput, 'Dados preliminares');

      // Clica no botão Cancelar
      const cancelBtn = screen.getByRole('button', { name: 'Cancelar' });
      await user.click(cancelBtn);

      // Deve exibir o diálogo de confirmação
      expect(await screen.findByText('Descartar alterações?')).toBeInTheDocument();
      expect(
        screen.getByText(/Você possui dados modificados neste formulário/i)
      ).toBeInTheDocument();

      // Clica em "Continuar editando" -> modal fecha, painel continua aberto
      const continuarBtn = screen.getByRole('button', { name: 'Continuar editando' });
      await user.click(continuarBtn);

      await waitFor(() => {
        expect(screen.queryByText('Descartar alterações?')).not.toBeInTheDocument();
        expect(nomeInput).toHaveValue('Dados preliminares');
      });

      // Tenta cancelar novamente e clica em "Descartar alterações"
      await user.click(cancelBtn);
      const descartarBtn = await screen.findByRole('button', { name: 'Descartar alterações' });
      await user.click(descartarBtn);

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('acessibilidade de teclado: Tab navega entre campos e Enter submete', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<TestComponent onSubmit={onSubmit} />);

      const nomeInput = screen.getByLabelText(/Nome Completo/i);
      const emailInput = screen.getByLabelText(/E-mail/i);

      nomeInput.focus();
      expect(nomeInput).toHaveFocus();

      await user.keyboard('Carlos Silva');
      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.keyboard('carlos@silva.adv.br');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          nome: 'Carlos Silva',
          email: 'carlos@silva.adv.br',
        });
      });
    });

    it('não possui violações de acessibilidade (axe) no painel aberto', async () => {
      const { container } = render(<TestComponent />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
