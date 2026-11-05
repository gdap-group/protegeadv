import { useEffect, useState } from 'react';
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
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  ToastProvider,
  useToast,
  Skeleton,
  EmptyState,
  DataTable,
} from '../components/ui';
import {
  FileText,
  HelpCircle,
  MoreVertical,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

interface ColorToken {
  name: string;
  variable: string;
  description: string;
}

const COLOR_TOKENS: ColorToken[] = [
  { name: 'bg', variable: '--color-bg', description: 'Fundo principal da aplicação' },
  { name: 'surface', variable: '--color-surface', description: 'Superfície de cartões e painéis' },
  { name: 'elevated', variable: '--color-elevated', description: 'Superfície elevada, menus e dropdowns' },
  { name: 'border', variable: '--color-border', description: 'Bordas sutis translúcidas' },
  { name: 'primary', variable: '--color-primary', description: 'Roxo principal de ação e foco' },
  { name: 'primary-hover', variable: '--color-primary-hover', description: 'Estado hover e fundo base de botões' },
  { name: 'glow', variable: '--color-glow', description: 'Brilho roxo suave, anéis de foco e links' },
  { name: 'gradient-from / primary', variable: '--color-gradient-from', description: 'Início do gradiente de destaque' },
  { name: 'gradient-to', variable: '--color-gradient-to', description: 'Fim do gradiente de destaque (índigo)' },
  { name: 'text', variable: '--color-text', description: 'Texto principal de alto contraste' },
  { name: 'muted', variable: '--color-muted', description: 'Texto secundário e descrições' },
  { name: 'success', variable: '--color-success', description: 'Estados de sucesso e em dia' },
  { name: 'warning', variable: '--color-warning', description: 'Estados de atenção e pendências' },
  { name: 'danger', variable: '--color-danger', description: 'Erros, prazos vencidos e alertas' },
];

function ToastDemoButtons() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({
            title: 'Notificação Padrão',
            description: 'Sincronização com o DJEN agendada para daqui a 1 hora.',
            variant: 'default',
          })
        }
      >
        Disparar Default
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({
            title: 'Publicação Capturada',
            description: 'Nova intimação judicial associada ao processo nº 0001234-56.',
            variant: 'success',
          })
        }
      >
        Disparar Sucesso
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({
            title: 'Prazo Fatal em 24h',
            description: 'Contestação referente aos autos do TJSP expira amanhã.',
            variant: 'warning',
          })
        }
      >
        Disparar Atenção
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() =>
          toast({
            title: 'Falha de Conexão',
            description: 'O tribunal retornou instabilidade momentânea (HTTP 503).',
            variant: 'danger',
          })
        }
      >
        Disparar Erro
      </Button>
    </div>
  );
}

export default function DesignPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    const resolved: Record<string, string> = {};
    for (const token of COLOR_TOKENS) {
      resolved[token.variable] = computed.getPropertyValue(token.variable).trim();
    }
    setValues(resolved);
  }, []);

  const tableSampleData = [
    { id: '1', cnj: '0001234-56.2026.8.26.0100', tribunal: 'TJSP', status: 'ativo', data: '05/11/2026' },
    { id: '2', cnj: '5004321-12.2026.4.03.6100', tribunal: 'TRF-3', status: 'pendente', data: '04/11/2026' },
    { id: '3', cnj: '1000987-77.2026.5.02.0001', tribunal: 'TRT-2', status: 'urgente', data: '03/11/2026' },
    { id: '4', cnj: '0005544-22.2026.8.26.0053', tribunal: 'TJSP', status: 'arquivado', data: '01/11/2026' },
    { id: '5', cnj: '5007788-99.2026.4.03.0000', tribunal: 'TRF-3', status: 'ativo', data: '28/10/2026' },
    { id: '6', cnj: '1002233-44.2026.8.26.0100', tribunal: 'TJSP', status: 'ativo', data: '25/10/2026' },
  ];

  const tableColumns = [
    {
      accessorKey: 'cnj',
      header: 'Número do Processo',
      cell: ({ row }: { row: { original: { cnj: string } } }) => (
        <span className="font-mono text-[var(--color-glow)]">{row.original.cnj}</span>
      ),
    },
    { accessorKey: 'tribunal', header: 'Tribunal' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: { row: { original: { status: string } } }) => {
        const s = row.original.status;
        if (s === 'ativo') return <Badge variant="success">Em dia</Badge>;
        if (s === 'pendente') return <Badge variant="warning">Aguardando</Badge>;
        if (s === 'urgente') return <Badge variant="danger">Prazo Fatal</Badge>;
        return <Badge variant="neutro">Arquivado</Badge>;
      },
    },
    {
      accessorKey: 'data',
      header: 'Última Leitura',
      cell: ({ row }: { row: { original: { data: string } } }) => (
        <span className="font-mono text-xs text-[var(--color-muted)]">{row.original.data}</span>
      ),
    },
  ];

  return (
    <ToastProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8 max-w-7xl mx-auto space-y-16">
          {/* Cabeçalho */}
          <header className="border-b border-[var(--color-border)] pb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Catálogo de Design System (Passo 3.2)</h1>
              <p className="text-[var(--color-muted)] mt-1 text-sm">
                Exibição de todos os 17 componentes base em todos os estados de interação, tokens e regras de acessibilidade.
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-mono font-medium rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-glow)]">
              DEV ONLY (/_design)
            </span>
          </header>

          {/* 1. Cores Oficiais e Contraste */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">
              1. Tokens Canônicos de Cores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COLOR_TOKENS.map((token) => (
                <div
                  key={token.variable}
                  className="p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center space-x-4 shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-[var(--radius-input)] border border-[var(--color-border)] shrink-0 shadow-sm"
                    style={{ backgroundColor: `var(${token.variable})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm truncate">{token.name}</span>
                      <span className="text-xs font-mono text-[var(--color-glow)]">
                        {values[token.variable] || 'lendo...'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-muted)] truncate mt-0.5 font-mono">
                      var({token.variable})
                    </p>
                    <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
                      {token.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Button em Todos os Estados */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">
              2. Button — Variantes e Estados
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              Texto branco sobre fundo roxo utiliza primary-hover (5,7:1) como base. O estado hover mantém o fundo primary-hover e adiciona brilho roxo (glow), preservando o contraste de 5,7:1.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="space-y-3">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Primary (Base primary-hover)</span>
                <div className="space-y-2">
                  <Button variant="primary" className="w-full">Normal</Button>
                  <Button variant="primary" className="w-full hover:shadow-[var(--shadow-glow)]">Hover Visual</Button>
                  <Button variant="primary" disabled className="w-full">Desabilitado</Button>
                  <Button variant="primary" loading className="w-full">Carregando</Button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Secondary</span>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full">Normal</Button>
                  <Button variant="secondary" className="w-full hover:bg-[var(--color-surface)]">Hover Visual</Button>
                  <Button variant="secondary" disabled className="w-full">Desabilitado</Button>
                  <Button variant="secondary" loading className="w-full">Carregando</Button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Ghost</span>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full">Normal</Button>
                  <Button variant="ghost" className="w-full bg-[var(--color-elevated)]">Hover Visual</Button>
                  <Button variant="ghost" disabled className="w-full">Desabilitado</Button>
                  <Button variant="ghost" loading className="w-full">Carregando</Button>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Danger</span>
                <div className="space-y-2">
                  <Button variant="danger" className="w-full">Normal</Button>
                  <Button variant="danger" className="w-full hover:brightness-110">Hover Visual</Button>
                  <Button variant="danger" disabled className="w-full">Desabilitado</Button>
                  <Button variant="danger" loading className="w-full">Carregando</Button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Inputs, Textarea e Select em Todos os Estados */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">
              3. Formulários — Input, Textarea e Select
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)]">
              {/* Inputs */}
              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Input (Estados)</span>
                <div>
                  <label htmlFor="inp-normal" className="block text-xs text-[var(--color-muted)] mb-1">Normal</label>
                  <Input id="inp-normal" placeholder="Ex: 5001234-89.2026.4.03.6100" />
                </div>
                <div>
                  <label htmlFor="inp-disabled" className="block text-xs text-[var(--color-muted)] mb-1">Desabilitado</label>
                  <Input id="inp-disabled" disabled placeholder="Campo bloqueado" />
                </div>
                <div>
                  <label htmlFor="inp-error" className="block text-xs text-[var(--color-danger)] mb-1">Erro de Validação</label>
                  <Input id="inp-error" error defaultValue="Número CNJ inválido" />
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Textarea (Estados)</span>
                <div>
                  <label htmlFor="txt-normal" className="block text-xs text-[var(--color-muted)] mb-1">Normal</label>
                  <Textarea id="txt-normal" placeholder="Descreva os termos da contestação..." />
                </div>
                <div>
                  <label htmlFor="txt-error" className="block text-xs text-[var(--color-danger)] mb-1">Erro</label>
                  <Textarea id="txt-error" error defaultValue="O teor não pode ficar vazio" />
                </div>
              </div>

              {/* Select */}
              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Select (Estados)</span>
                <div>
                  <label id="lbl-sel-normal" className="block text-xs text-[var(--color-muted)] mb-1">Normal</label>
                  <Select defaultValue="tjsp">
                    <SelectTrigger aria-labelledby="lbl-sel-normal">
                      <SelectValue placeholder="Selecione o tribunal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tjsp">TJSP - Tribunal de Justiça de SP</SelectItem>
                      <SelectItem value="trf3">TRF-3 - Tribunal Regional Federal</SelectItem>
                      <SelectItem value="trt2">TRT-2 - Tribunal do Trabalho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label id="lbl-sel-disabled" className="block text-xs text-[var(--color-muted)] mb-1">Desabilitado</label>
                  <Select disabled defaultValue="tjsp">
                    <SelectTrigger aria-labelledby="lbl-sel-disabled">
                      <SelectValue placeholder="Bloqueado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tjsp">TJSP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label id="lbl-sel-error" className="block text-xs text-[var(--color-danger)] mb-1">Erro</label>
                  <Select>
                    <SelectTrigger error aria-labelledby="lbl-sel-error">
                      <SelectValue placeholder="Selecione obrigatoriamente..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="opcao1">Opção de Teste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Checkbox e Switch */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">
              4. Seletores — Checkbox e Switch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)]">
              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Checkbox</span>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c-normal" defaultChecked />
                  <label htmlFor="c-normal" className="text-sm">Marcado (Normal)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c-unchecked" />
                  <label htmlFor="c-unchecked" className="text-sm">Desmarcado</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="c-disabled" disabled defaultChecked />
                  <label htmlFor="c-disabled" className="text-sm text-[var(--color-muted)]">Marcado (Desabilitado)</label>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)]">Switch</span>
                <div className="flex items-center space-x-3">
                  <Switch id="s-active" defaultChecked />
                  <label htmlFor="s-active" className="text-sm">Monitoramento Ativo (Ligado)</label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch id="s-inactive" />
                  <label htmlFor="s-inactive" className="text-sm">Notificações por WhatsApp (Desligado)</label>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch id="s-disabled" disabled defaultChecked />
                  <label htmlFor="s-disabled" className="text-sm text-[var(--color-muted)]">Bloqueado no Plano (Desabilitado)</label>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Badge com Variantes Semânticas (com Ícones) */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">
              5. Badge — Semântica com Ícone + Texto (Acessibilidade)
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              Nenhum significado apenas por cor: cada estado traz ícone ilustrativo acompanhado de texto nítido.
            </p>
            <div className="flex flex-wrap gap-4 p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)]">
              <Badge variant="success">Em dia</Badge>
              <Badge variant="warning">Aguardando Leitura</Badge>
              <Badge variant="danger">Prazo Fatal Vencendo</Badge>
              <Badge variant="neutro">Arquivado Definitivamente</Badge>
              <Badge variant="info">Informativo DJEN</Badge>
            </div>
          </section>

          {/* 6. Tabs, Card e Links no Card (com glow) */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">
              6. Card e Tabs — Links com cor glow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card glow>
                <CardHeader>
                  <CardTitle>Painel do Processo (Card com Glow)</CardTitle>
                  <CardDescription>Visualização em abas com links em destaque glow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="publicacoes">
                    <TabsList aria-label="Abas do Processo">
                      <TabsTrigger value="publicacoes">Publicações (3)</TabsTrigger>
                      <TabsTrigger value="andamentos">Andamentos (12)</TabsTrigger>
                      <TabsTrigger value="partes">Partes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="publicacoes" className="p-3 bg-[var(--color-elevated)] rounded-[var(--radius-input)] text-sm space-y-2 mt-3">
                      <p>Intimação para apresentação de contrarrazões de apelação.</p>
                      <a href="#link-glow" className="inline-block text-xs font-semibold text-[var(--color-glow)] hover:underline">
                        Ver teor completo no diário judicial &rarr;
                      </a>
                    </TabsContent>
                    <TabsContent value="andamentos" className="p-3 bg-[var(--color-elevated)] rounded-[var(--radius-input)] text-sm mt-3">
                      <p>Conclusos para decisão interlocutória em 04/11/2026.</p>
                    </TabsContent>
                    <TabsContent value="partes" className="p-3 bg-[var(--color-elevated)] rounded-[var(--radius-input)] text-sm mt-3">
                      <p>Autor: Escritório Protege ADV | Réu: Banco Exemplo S/A.</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="justify-between border-t border-[var(--color-border)] pt-4">
                  <span className="text-xs text-[var(--color-muted)] font-mono">TJSP - 1ª Vara Cível</span>
                  <a href="#link-processo" className="text-xs font-medium text-[var(--color-glow)] hover:underline">
                    Abrir pasta no tribunal &rarr;
                  </a>
                </CardFooter>
              </Card>

              {/* Skeleton e EmptyState */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skeleton (Placeholder de Carregamento)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full rounded-[var(--radius-input)]" />
                  </CardContent>
                </Card>

                <EmptyState
                  title="Nenhum andamento recente"
                  description="As fontes públicas foram consultadas e não houve novas movimentações nas últimas 24 horas."
                  action={
                    <Button variant="secondary" size="sm">
                      <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                      Consultar DataJud Agora
                    </Button>
                  }
                />
              </div>
            </div>
          </section>

          {/* 7. Dialog, Sheet, Dropdown, Tooltip e Toast */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">
              7. Modais, Painéis, Dropdowns, Tooltips e Toasts
            </h2>
            <div className="p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)] space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                {/* Dialog Trigger */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="primary">
                      <Plus className="h-4 w-4 mr-1.5" />
                      Abrir Dialog (Modal)
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Novo Processo</DialogTitle>
                      <DialogDescription>
                        Insira o número CNJ para iniciar o monitoramento diário no DJEN e DataJud.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                      <label htmlFor="modal-cnj" className="block text-xs font-medium text-[var(--color-muted)]">
                        Número Único CNJ
                      </label>
                      <Input id="modal-cnj" placeholder="0001234-56.2026.8.26.0100" />
                    </div>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button variant="primary" onClick={() => setDialogOpen(false)}>
                        Iniciar Monitoramento
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Sheet Trigger */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="secondary">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Abrir Sheet (Painel Lateral)
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Teor da Publicação Judicial</SheetTitle>
                      <SheetDescription>
                        Diário da Justiça Eletrônico Nacional — DJEN (Edição 142/2026)
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 py-4 text-sm leading-relaxed">
                      <div className="p-3 rounded-[var(--radius-input)] bg-[var(--color-elevated)] border border-[var(--color-border)] space-y-1">
                        <div className="text-xs text-[var(--color-muted)]">Processo</div>
                        <div className="font-mono text-[var(--color-glow)] font-semibold">0001234-56.2026.8.26.0100</div>
                      </div>
                      <p className="text-[var(--color-text)]">
                        Fica a parte autora intimada para manifestação sobre a contestação juntada aos autos no prazo legal de 15 (quinze) dias úteis.
                      </p>
                      <div className="flex gap-2 pt-4">
                        <Button variant="primary" size="sm" className="flex-1">Criar Prazo na Agenda</Button>
                        <Button variant="secondary" size="sm" onClick={() => setSheetOpen(false)}>Fechar</Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary">
                      <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                      Menu de Ações
                      <MoreVertical className="h-4 w-4 ml-1.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Operações</DropdownMenuLabel>
                    <DropdownMenuItem>Editar Metadados</DropdownMenuItem>
                    <DropdownMenuItem>Exportar Relatório PDF</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem danger>Excluir do Monitoramento</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Tooltip */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Ajuda sobre prazos">
                      <HelpCircle className="h-5 w-5 text-[var(--color-muted)] hover:text-[var(--color-glow)]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Prazos processuais são calculados excluindo feriados locais e suspensões forenses cadastradas.
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Toasts */}
              <div className="space-y-2 border-t border-[var(--color-border)] pt-4">
                <span className="text-xs uppercase font-semibold text-[var(--color-glow)] block">
                  Disparar Toasts Notificadores
                </span>
                <ToastDemoButtons />
              </div>
            </div>
          </section>

          {/* 8. DataTable com TanStack Table */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-[var(--color-border)] pb-2">
              8. DataTable — Ordenação, Paginação e Seleção (44px Altura)
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              Tabela construída com TanStack Table, ordenação ao clicar no cabeçalho, paginação integrada e seleção de linhas.
            </p>
            <DataTable columns={tableColumns} data={tableSampleData} pageSize={3} />
          </section>
        </div>
      </TooltipProvider>
    </ToastProvider>
  );
}
