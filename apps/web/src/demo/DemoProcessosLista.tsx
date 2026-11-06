import * as React from 'react';
import { Link } from 'react-router-dom';
import { type ColumnDef } from '@tanstack/react-table';
import { Plus, CheckCircle2, AlertTriangle } from 'lucide-react';
import { z } from 'zod';
import { PaginaLista, type QuickFilter } from '../components/patterns/PaginaLista';
import {
  FormularioEmPainel,
  FormFieldItem,
  FormFieldLabel,
  FormFieldErrorMessage,
} from '../components/patterns/FormularioEmPainel';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useDemo } from './DemoContext';
import { type DemoProcesso } from './dados-demo';

const novoProcessoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  cliente: z.string().min(2, 'Informe o cliente ou empresa'),
  tribunal: z.string().min(2, 'Informe o tribunal ou comarca'),
  valorCausa: z.string().min(1, 'Informe o valor da causa'),
});

type NovoProcessoForm = z.infer<typeof novoProcessoSchema>;

export function DemoProcessosLista() {
  const { processos, adicionarProcesso } = useDemo();
  const [searchValue, setSearchValue] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState('todos');
  const [panelOpen, setPanelOpen] = React.useState(false);

  // Filtros rápidos computados
  const totalCount = processos.length;
  const prazoProximoCount = React.useMemo(
    () => processos.filter((p) => p.temPrazoProximo).length,
    [processos]
  );
  const semAndamentoCount = React.useMemo(
    () => processos.filter((p) => p.semAndamentoHa30Dias).length,
    [processos]
  );

  const quickFilters: QuickFilter[] = [
    { id: 'todos', label: 'Todos', count: totalCount },
    { id: 'prazo-proximo', label: 'Com prazo próximo', count: prazoProximoCount },
    { id: 'sem-andamento', label: 'Sem andamento há 30 dias', count: semAndamentoCount },
  ];

  // Filtragem dos dados na memória
  const filteredData = React.useMemo(() => {
    return processos.filter((p) => {
      // Filtro rápido
      if (activeFilter === 'prazo-proximo' && !p.temPrazoProximo) return false;
      if (activeFilter === 'sem-andamento' && !p.semAndamentoHa30Dias) return false;

      // Busca por texto
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchCnj = p.cnj.toLowerCase().includes(query);
        const matchTitulo = p.titulo.toLowerCase().includes(query);
        const matchCliente = p.cliente.toLowerCase().includes(query);
        const matchTrib = p.tribunal.toLowerCase().includes(query);
        if (!matchCnj && !matchTitulo && !matchCliente && !matchTrib) {
          return false;
        }
      }

      return true;
    });
  }, [processos, activeFilter, searchValue]);

  // Colunas da DataTable
  const columns = React.useMemo<ColumnDef<DemoProcesso, unknown>[]>(
    () => [
      {
        accessorKey: 'cnj',
        header: 'Número do Processo',
        cell: ({ row }) => (
          <Link
            to={`/demo/processos/${row.original.id}`}
            className="font-mono text-xs sm:text-sm text-[var(--color-glow)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)] rounded-xs"
          >
            {row.original.cnj}
          </Link>
        ),
      },
      {
        accessorKey: 'titulo',
        header: 'Ação / Demanda',
        cell: ({ row }) => (
          <div className="max-w-xs truncate font-medium text-xs sm:text-sm text-[var(--color-text)]">
            {row.original.titulo}
          </div>
        ),
      },
      {
        accessorKey: 'cliente',
        header: 'Cliente',
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate text-xs text-[var(--color-muted)]">
            {row.original.cliente}
          </div>
        ),
      },
      {
        accessorKey: 'tribunal',
        header: 'Tribunal / Vara',
        cell: ({ row }) => (
          <span className="text-xs text-[var(--color-muted)]">
            {row.original.tribunal}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Situação',
        cell: ({ row }) => {
          const s = row.original.status;
          if (s === 'ativo') {
            return (
              <Badge variant="success" className="gap-1 py-0.2 px-2 text-[11px]">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                <span>Em dia</span>
              </Badge>
            );
          }
          return (
            <Badge variant="warning" className="gap-1 py-0.2 px-2 text-[11px]">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              <span>Suspenso</span>
            </Badge>
          );
        },
      },
      {
        accessorKey: 'dataUltimoAndamento',
        header: 'Último Andamento',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-[var(--color-muted)]">
            {row.original.dataUltimoAndamento}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PaginaLista<DemoProcesso, unknown>
        title="Processos em Monitoramento"
        description="Acompanhamento automatizado de andamentos com busca rápida e filtros por criticidade."
        breadcrumbs={[{ label: 'Início', href: '/demo/processos' }, { label: 'Processos' }]}
        primaryAction={{
          label: 'Novo Processo',
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setPanelOpen(true),
        }}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Buscar por CNJ, cliente, ação ou tribunal..."
        quickFilters={quickFilters}
        activeQuickFilter={activeFilter}
        onQuickFilterChange={setActiveFilter}
        columns={columns}
        data={filteredData}
        pageSize={10}
        emptyTitle="Nenhum processo encontrado"
        emptyDescription="Não há processos correspondentes aos critérios de busca ou filtros selecionados."
        emptyAction={{
          label: 'Limpar Filtros',
          onClick: () => {
            setSearchValue('');
            setActiveFilter('todos');
          },
        }}
      />

      {/* Painel Lateral com Formulário de Cadastro */}
      <FormularioEmPainel<NovoProcessoForm>
        open={panelOpen}
        onOpenChange={setPanelOpen}
        title="Cadastrar Novo Processo"
        description="Insira os dados principais da demanda para inclusão no monitoramento."
        schema={novoProcessoSchema}
        defaultValues={{
          titulo: '',
          cliente: '',
          tribunal: 'TJMG',
          valorCausa: '',
        }}
        submitLabel="Cadastrar Processo"
        cancelLabel="Cancelar"
        onSubmit={async (data) => {
          adicionarProcesso({
            titulo: data.titulo,
            cliente: data.cliente,
            tribunal: data.tribunal,
            vara: `${data.tribunal} — Vara Cível Central`,
            valorCausa: data.valorCausa,
          });
          setPanelOpen(false);
        }}
      >
        {(form) => (
          <div className="space-y-4">
            <FormFieldItem>
              <FormFieldLabel htmlFor="form-titulo" required>
                Título ou Objeto da Ação
              </FormFieldLabel>
              <Input
                id="form-titulo"
                placeholder="Ex: Ação Rescisória de Contrato"
                {...form.register('titulo')}
                aria-invalid={!!form.formState.errors.titulo}
              />
              <FormFieldErrorMessage>
                {form.formState.errors.titulo?.message}
              </FormFieldErrorMessage>
            </FormFieldItem>

            <FormFieldItem>
              <FormFieldLabel htmlFor="form-cliente" required>
                Nome do Cliente / Empresa
              </FormFieldLabel>
              <Input
                id="form-cliente"
                placeholder="Ex: Alfa Logística S.A."
                {...form.register('cliente')}
                aria-invalid={!!form.formState.errors.cliente}
              />
              <FormFieldErrorMessage>
                {form.formState.errors.cliente?.message}
              </FormFieldErrorMessage>
            </FormFieldItem>

            <FormFieldItem>
              <FormFieldLabel htmlFor="form-tribunal" required>
                Tribunal / Órgão
              </FormFieldLabel>
              <Input
                id="form-tribunal"
                placeholder="Ex: TJMG ou TRT3"
                {...form.register('tribunal')}
                aria-invalid={!!form.formState.errors.tribunal}
              />
              <FormFieldErrorMessage>
                {form.formState.errors.tribunal?.message}
              </FormFieldErrorMessage>
            </FormFieldItem>

            <FormFieldItem>
              <FormFieldLabel htmlFor="form-valor" required>
                Valor da Causa
              </FormFieldLabel>
              <Input
                id="form-valor"
                placeholder="Ex: R$ 85.000,00"
                {...form.register('valorCausa')}
                aria-invalid={!!form.formState.errors.valorCausa}
              />
              <FormFieldErrorMessage>
                {form.formState.errors.valorCausa?.message}
              </FormFieldErrorMessage>
            </FormFieldItem>
          </div>
        )}
      </FormularioEmPainel>
    </div>
  );
}
