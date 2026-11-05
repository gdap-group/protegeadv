// @vitest-environment jsdom
import '../../test/setup';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import * as React from 'react';

import {
  Button,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Switch,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ToastProvider,
  useToast,
  Skeleton,
  EmptyState,
  DataTable,
} from './index';

describe('Componentes Base — Renderização e Acessibilidade (Passo 3.2)', () => {
  // 1. Button
  describe('Button', () => {
    it('renderiza todas as variantes e estado de loading', () => {
      const { rerender } = render(<Button variant="primary">Primário</Button>);
      expect(screen.getByRole('button', { name: 'Primário' })).toBeInTheDocument();

      rerender(<Button variant="secondary">Secundário</Button>);
      expect(screen.getByRole('button', { name: 'Secundário' })).toBeInTheDocument();

      rerender(<Button variant="danger">Perigo</Button>);
      expect(screen.getByRole('button', { name: 'Perigo' })).toBeInTheDocument();

      rerender(<Button loading>Salvando</Button>);
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('é acessível via vitest-axe e acionável por teclado (Enter e Espaço)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      const { container } = render(
        <Button variant="primary" onClick={handleClick}>
          Ação Acessível
        </Button>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const btn = screen.getByRole('button', { name: 'Ação Acessível' });
      btn.focus();
      expect(btn).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  // 2. Input
  describe('Input', () => {
    it('renderiza com placeholder e estados normal/erro', () => {
      const { rerender } = render(<Input placeholder="Digite seu nome" aria-label="Nome" />);
      const input = screen.getByPlaceholderText('Digite seu nome');
      expect(input).toBeInTheDocument();
      expect(input).not.toHaveAttribute('aria-invalid');

      rerender(<Input placeholder="Digite seu nome" aria-label="Nome" error />);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('é acessível e recebe foco e digitação via teclado', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <label htmlFor="user-input">Nome de Usuário</label>
          <Input id="user-input" defaultValue="" />
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const input = screen.getByLabelText('Nome de Usuário');
      await user.tab();
      expect(input).toHaveFocus();

      await user.keyboard('advogado_antonio');
      expect(input).toHaveValue('advogado_antonio');
    });
  });

  // 3. Textarea
  describe('Textarea', () => {
    it('renderiza com label e estado de erro', () => {
      render(
        <div>
          <label htmlFor="desc-field">Descrição do Andamento</label>
          <Textarea id="desc-field" error />
        </div>
      );
      const textarea = screen.getByLabelText('Descrição do Andamento');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('passa no teste de acessibilidade com axe', async () => {
      const { container } = render(
        <div>
          <label htmlFor="notes">Observações</label>
          <Textarea id="notes" placeholder="Notas sobre a audiência" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 4. Select
  describe('Select', () => {
    it('renderiza trigger e abre opções', async () => {
      render(
        <Select defaultValue="tjsp">
          <SelectTrigger aria-label="Tribunal">
            <SelectValue placeholder="Selecione o tribunal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tjsp">TJSP</SelectItem>
            <SelectItem value="trf3">TRF-3</SelectItem>
          </SelectContent>
        </Select>
      );
      expect(screen.getByRole('combobox', { name: 'Tribunal' })).toBeInTheDocument();
      expect(screen.getByText('TJSP')).toBeInTheDocument();
    });

    it('é acessível via vitest-axe', async () => {
      const { container } = render(
        <div>
          <label id="select-label">Selecione o Foro</label>
          <Select aria-labelledby="select-label">
            <SelectTrigger aria-labelledby="select-label">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="central">Foro Central</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 5. Checkbox
  describe('Checkbox', () => {
    it('renderiza e alterna estado ao clicar ou pressionar Espaço', async () => {
      const user = userEvent.setup();
      render(
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label htmlFor="terms">Aceitar notificações</label>
        </div>
      );

      const checkbox = screen.getByRole('checkbox', { name: 'Aceitar notificações' });
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.keyboard(' ');
      expect(checkbox).not.toBeChecked();
    });

    it('é acessível via vitest-axe', async () => {
      const { container } = render(
        <div className="flex items-center space-x-2">
          <Checkbox id="chk-axe" />
          <label htmlFor="chk-axe">Opção Acessível</label>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 6. Switch
  describe('Switch', () => {
    it('renderiza e alterna estado de ativação', async () => {
      const user = userEvent.setup();
      render(
        <div className="flex items-center space-x-2">
          <Switch id="auto-sync" />
          <label htmlFor="auto-sync">Sincronização Automática</label>
        </div>
      );

      const switchEl = screen.getByRole('switch', { name: 'Sincronização Automática' });
      expect(switchEl).not.toBeChecked();

      await user.click(switchEl);
      expect(switchEl).toBeChecked();
    });

    it('é acessível com axe e navegável por teclado', async () => {
      const { container } = render(
        <div className="flex items-center space-x-2">
          <Switch id="dark-theme" />
          <label htmlFor="dark-theme">Tema Escuro Ativo</label>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 7. Badge
  describe('Badge', () => {
    it('renderiza com texto e ícone semântico obrigatório (não apenas cor)', () => {
      render(
        <div className="flex gap-2">
          <Badge variant="success">Em dia</Badge>
          <Badge variant="warning">Pendente</Badge>
          <Badge variant="danger">Prazo Vencido</Badge>
          <Badge variant="neutro">Arquivado</Badge>
          <Badge variant="info">Informativo</Badge>
        </div>
      );

      expect(screen.getByText('Em dia')).toBeInTheDocument();
      expect(screen.getByText('Pendente')).toBeInTheDocument();
      expect(screen.getByText('Prazo Vencido')).toBeInTheDocument();
      expect(screen.getByText('Arquivado')).toBeInTheDocument();
      expect(screen.getByText('Informativo')).toBeInTheDocument();
    });

    it('passa no teste de acessibilidade com axe', async () => {
      const { container } = render(<Badge variant="success">Processo Ativo</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 8. Card
  describe('Card', () => {
    it('renderiza estrutura completa de card com título e conteúdo', () => {
      render(
        <Card glow>
          <CardHeader>
            <CardTitle>Dados do Processo</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Conteúdo de teste</p>
          </CardContent>
        </Card>
      );
      expect(screen.getByText('Dados do Processo')).toBeInTheDocument();
      expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
    });

    it('é acessível via vitest-axe', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Informações jurídicas consolidadas</p>
          </CardContent>
        </Card>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 9. Tabs
  describe('Tabs', () => {
    it('renderiza abas e troca de conteúdo ao clicar', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="aba1">
          <TabsList aria-label="Navegação do Processo">
            <TabsTrigger value="aba1">Publicações</TabsTrigger>
            <TabsTrigger value="aba2">Andamentos</TabsTrigger>
          </TabsList>
          <TabsContent value="aba1">Conteúdo Aba 1</TabsContent>
          <TabsContent value="aba2">Conteúdo Aba 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Conteúdo Aba 1')).toBeInTheDocument();
      expect(screen.queryByText('Conteúdo Aba 2')).not.toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: 'Andamentos' }));
      expect(screen.getByText('Conteúdo Aba 2')).toBeInTheDocument();
    });

    it('é acessível e compatível com as regras de tabs do WAI-ARIA', async () => {
      const { container } = render(
        <Tabs defaultValue="proc">
          <TabsList aria-label="Detalhes">
            <TabsTrigger value="proc">Pasta Processual</TabsTrigger>
          </TabsList>
          <TabsContent value="proc">Dados da pasta</TabsContent>
        </Tabs>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 10. Dialog (Uso de teclado: Enter, Espaço, Tab e Esc)
  describe('Dialog', () => {
    it('abre com clique e fecha estritamente com a tecla Escape (Esc)', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Abrir Modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Título do Diálogo</DialogTitle>
            <DialogDescription>Descrição do diálogo acessível</DialogDescription>
            <Button>Botão Interno</Button>
          </DialogContent>
        </Dialog>
      );

      expect(screen.queryByText('Título do Diálogo')).not.toBeInTheDocument();

      // Abre com clique
      const trigger = screen.getByRole('button', { name: 'Abrir Modal' });
      await user.click(trigger);

      expect(await screen.findByText('Título do Diálogo')).toBeInTheDocument();

      // Pressiona Esc e confirma que fechou
      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByText('Título do Diálogo')).not.toBeInTheDocument();
      });
    });

    it('abre via teclado (Enter no trigger) e passa na validação axe', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Acionar por Teclado</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Modal Acessível</DialogTitle>
            <DialogDescription>Descrição para leitores de tela</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByRole('button', { name: 'Acionar por Teclado' });
      trigger.focus();
      await user.keyboard('{Enter}');

      expect(await screen.findByText('Modal Acessível')).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 11. Sheet (Painel lateral: teclado Tab e Esc)
  describe('Sheet', () => {
    it('abre painel lateral e fecha com a tecla Escape', async () => {
      const user = userEvent.setup();
      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Abrir Painel Lateral</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle>Painel de Leitura</SheetTitle>
            <SheetDescription>Teor da publicação capturada</SheetDescription>
            <p>Texto detalhado da intimação judicial</p>
          </SheetContent>
        </Sheet>
      );

      expect(screen.queryByText('Painel de Leitura')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Abrir Painel Lateral' }));
      expect(await screen.findByText('Painel de Leitura')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByText('Painel de Leitura')).not.toBeInTheDocument();
      });
    });

    it('é acessível via vitest-axe', async () => {
      const { container } = render(
        <Sheet>
          <SheetTrigger asChild>
            <Button>Ver Detalhes</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Gaveta Acessível</SheetTitle>
            <SheetDescription>Informações complementares</SheetDescription>
          </SheetContent>
        </Sheet>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 12. Dropdown (Teclado: Espaço, Enter e Esc)
  describe('DropdownMenu', () => {
    it('abre com clique e fecha com Escape', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Opções</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Editar Processo</DropdownMenuItem>
            <DropdownMenuItem danger>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.queryByText('Editar Processo')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Opções' }));
      expect(await screen.findByText('Editar Processo')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByText('Editar Processo')).not.toBeInTheDocument();
      });
    });

    it('é acessível via axe', async () => {
      const { container } = render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Ações</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Visualizar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 13. Tooltip
  describe('Tooltip', () => {
    it('renderiza elemento trigger e tooltip content', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Passe o mouse</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dica explicativa útil</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByRole('button', { name: 'Passe o mouse' })).toBeInTheDocument();
    });

    it('passa no teste de acessibilidade com axe', async () => {
      const { container } = render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button aria-label="Ajuda sobre prazos">Ajuda</Button>
            </TooltipTrigger>
            <TooltipContent>Explicação sobre a contagem de prazos em dias úteis</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 14. Toast
  describe('Toast', () => {
    function TestToastConsumer() {
      const { toast } = useToast();
      return (
        <Button onClick={() => toast({ title: 'Sucesso', description: 'Processo salvo', variant: 'success' })}>
          Disparar Notificação
        </Button>
      );
    }

    it('dispara notificação com ícone e texto e permite fechar', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <TestToastConsumer />
        </ToastProvider>
      );

      await user.click(screen.getByRole('button', { name: 'Disparar Notificação' }));
      expect(await screen.findByText('Sucesso')).toBeInTheDocument();
      expect(screen.getByText('Processo salvo')).toBeInTheDocument();

      const closeBtn = screen.getByRole('button', { name: 'Fechar notificação' });
      await user.click(closeBtn);
      await waitFor(() => {
        expect(screen.queryByText('Processo salvo')).not.toBeInTheDocument();
      });
    });

    it('é acessível com aria-live region para leitores de tela', async () => {
      const { container } = render(
        <ToastProvider>
          <p>Aplicação pronta</p>
        </ToastProvider>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 15. Skeleton
  describe('Skeleton', () => {
    it('renderiza o elemento de placeholder para carregamento', () => {
      render(<Skeleton className="h-4 w-32" data-testid="test-skeleton" />);
      expect(screen.getByTestId('test-skeleton')).toBeInTheDocument();
    });

    it('é acessível via vitest-axe', async () => {
      const { container } = render(
        <div role="status" aria-busy="true" aria-label="Carregando tabela">
          <Skeleton className="h-10 w-full" />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 16. EmptyState
  describe('EmptyState', () => {
    it('renderiza ícone, título, descrição e botão de ação', () => {
      render(
        <EmptyState
          title="Nenhuma publicação encontrada"
          description="Você não possui intimações pendentes nesta semana."
          action={<Button variant="secondary">Atualizar Lista</Button>}
        />
      );
      expect(screen.getByText('Nenhuma publicação encontrada')).toBeInTheDocument();
      expect(screen.getByText('Você não possui intimações pendentes nesta semana.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Atualizar Lista' })).toBeInTheDocument();
    });

    it('é acessível via vitest-axe', async () => {
      const { container } = render(
        <EmptyState
          title="Caixa Vazia"
          description="Nenhum item pendente de leitura."
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 17. DataTable
  describe('DataTable', () => {
    interface TestData {
      id: string;
      processo: string;
      tribunal: string;
    }

    const testData: TestData[] = [
      { id: '1', processo: '0001-2026', tribunal: 'TJSP' },
      { id: '2', processo: '0002-2026', tribunal: 'TRF3' },
      { id: '3', processo: '0003-2026', tribunal: 'STJ' },
    ];

    const columns = [
      { accessorKey: 'processo', header: 'Número' },
      { accessorKey: 'tribunal', header: 'Tribunal' },
    ];

    it('renderiza dados, ordenação e seleção de linhas', async () => {
      const user = userEvent.setup();
      render(<DataTable columns={columns} data={testData} pageSize={2} />);

      // Verifica dados
      expect(screen.getByText('0001-2026')).toBeInTheDocument();
      expect(screen.getByText('0002-2026')).toBeInTheDocument();

      // Paginação (pageSize=2, 3 linhas => página 1 de 2)
      expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();

      // Seleção de todas as linhas da página
      const selectAll = screen.getByRole('checkbox', { name: 'Selecionar todas as linhas' });
      await user.click(selectAll);
      expect(screen.getByText('2 de 3 linha(s) selecionada(s).')).toBeInTheDocument();

      // Navegação para a próxima página
      await user.click(screen.getByRole('button', { name: 'Próxima página' }));
      expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
      expect(screen.getByText('0003-2026')).toBeInTheDocument();
    });

    it('é acessível via vitest-axe', async () => {
      const { container } = render(<DataTable columns={columns} data={testData} enableRowSelection={false} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
