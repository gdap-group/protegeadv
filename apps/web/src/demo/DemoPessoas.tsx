import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Mail,
  Phone,
  Briefcase,
  Building2,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardHeader, CardContent } from '../components/ui/card';
import { useDemo } from './DemoContext';
import { type DemoPessoa } from './dados-demo';
import { cn } from '../lib/utils';

export function DemoPessoas() {
  const { pessoas, processos } = useDemo();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedPessoaId, setSelectedPessoaId] = React.useState<string>(pessoas[0]?.id || '');

  const filteredPessoas = React.useMemo(() => {
    if (!searchTerm.trim()) return pessoas;
    const q = searchTerm.toLowerCase();
    return pessoas.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.documentoMascarado.includes(q)
    );
  }, [pessoas, searchTerm]);

  const selectedPessoa: DemoPessoa | undefined =
    pessoas.find((p) => p.id === selectedPessoaId) || pessoas[0];

  // Processos ligados à pessoa selecionada
  const processosLigados = React.useMemo(() => {
    if (!selectedPessoa) return [];
    return processos.filter((proc) => selectedPessoa.processosIds.includes(proc.id));
  }, [selectedPessoa, processos]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cadastro de Pessoas e Envolvidos"
        description="Diretório unificado de clientes, partes contrárias, advogados e testemunhas."
        breadcrumbs={[{ label: 'Início', href: '/demo/processos' }, { label: 'Pessoas' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna da Esquerda: Lista de Pessoas */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted)] pointer-events-none"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Buscar por nome, e-mail ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar pessoa"
              className="pl-9 h-9 text-xs sm:text-sm bg-[var(--color-surface)]"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredPessoas.map((p) => {
              const isSelected = p.id === selectedPessoa?.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPessoaId(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPessoaId(p.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver detalhes de ${p.nome}`}
                  className={cn(
                    'p-3.5 rounded-[var(--radius-card)] border transition-all cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                    isSelected
                      ? 'bg-[var(--color-elevated)] border-[var(--color-primary)] shadow-sm'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-elevated)]/60'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-glow)]">
                      {p.tipo === 'pj' ? <Building2 className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-[var(--color-text)] truncate block">
                        {p.nome}
                      </span>
                      <span className="text-[11px] text-[var(--color-muted)] font-mono block">
                        {p.documentoMascarado} &bull; {p.tipo.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--color-muted)] shrink-0 ml-2" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna da Direita: Ficha Detalhada da Pessoa */}
        <div className="lg:col-span-7">
          {selectedPessoa ? (
            <Card className="bg-[var(--color-surface)] border-[var(--color-border)] shadow-md">
              <CardHeader className="pb-4 border-b border-[var(--color-border)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--color-text)]">
                      {selectedPessoa.nome}
                    </h2>
                    <span className="font-mono text-xs text-[var(--color-glow)] mt-0.5 block">
                      Doc: {selectedPessoa.documentoMascarado} ({selectedPessoa.tipo === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPessoa.perfis.map((perf) => (
                      <Badge key={perf} variant="neutro" className="text-[10px] py-0.2">
                        {perf}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-5">
                {/* Contatos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[var(--color-bg)] rounded-[var(--radius-input)] border border-[var(--color-border)] flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-[var(--color-glow)] shrink-0" />
                    <span className="truncate text-[var(--color-text)]">{selectedPessoa.email}</span>
                  </div>
                  <div className="p-3 bg-[var(--color-bg)] rounded-[var(--radius-input)] border border-[var(--color-border)] flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-[var(--color-glow)] shrink-0" />
                    <span className="truncate text-[var(--color-text)]">{selectedPessoa.telefone}</span>
                  </div>
                </div>

                {/* Processos Ligados */}
                <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5 text-[var(--color-glow)]" />
                      Processos Judiciais Vinculados ({processosLigados.length})
                    </h3>
                  </div>

                  {processosLigados.length === 0 ? (
                    <p className="text-xs text-[var(--color-muted)] p-4 bg-[var(--color-bg)] rounded-[var(--radius-input)]">
                      Nenhum processo em andamento registrado para esta pessoa.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {processosLigados.map((proc) => (
                        <div
                          key={proc.id}
                          className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-input)] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div>
                            <Link
                              to={`/demo/processos/${proc.id}`}
                              className="font-mono text-xs text-[var(--color-glow)] hover:underline font-semibold block"
                            >
                              {proc.cnj}
                            </Link>
                            <span className="text-xs text-[var(--color-text)] block mt-0.5">
                              {proc.titulo}
                            </span>
                            <span className="text-[11px] text-[var(--color-muted)]">
                              {proc.tribunal} &bull; Valor: {proc.valorCausa}
                            </span>
                          </div>
                          <Badge variant={proc.status === 'ativo' ? 'success' : 'warning'} className="self-start sm:self-center text-[10px]">
                            {proc.status === 'ativo' ? 'Em dia' : 'Suspenso'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] text-[var(--color-muted)] text-sm">
              Selecione uma pessoa à esquerda para visualizar sua ficha.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
