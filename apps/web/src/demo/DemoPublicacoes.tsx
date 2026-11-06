import * as React from 'react';
import {
  CheckCircle,
  Eye,
  Link as LinkIcon,
  Clock,
  Building2,
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '../components/ui/sheet';
import { useDemo } from './DemoContext';
import { type DemoPublicacaoInbox } from './dados-demo';
import { cn } from '../lib/utils';

export function DemoPublicacoes() {
  const { publicacoes, processos, marcarPublicacaoLida, vincularPublicacaoProcesso } = useDemo();
  const [selectedPub, setSelectedPub] = React.useState<DemoPublicacaoInbox | null>(null);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedProcessoId, setSelectedProcessoId] = React.useState<string>('');
  const [vinculadoSucesso, setVinculadoSucesso] = React.useState(false);

  const handleOpenPub = (pub: DemoPublicacaoInbox) => {
    setSelectedPub(pub);
    setSelectedProcessoId(pub.processoId || processos[0]?.id || '');
    setVinculadoSucesso(false);
    setSheetOpen(true);
  };

  const handleToggleLida = () => {
    if (!selectedPub) return;
    const novoStatus = !selectedPub.lida;
    marcarPublicacaoLida(selectedPub.id, novoStatus);
    setSelectedPub((prev) => (prev ? { ...prev, lida: novoStatus } : null));
  };

  const handleVincular = () => {
    if (!selectedPub || !selectedProcessoId) return;
    vincularPublicacaoProcesso(selectedPub.id, selectedProcessoId);
    setSelectedPub((prev) => (prev ? { ...prev, processoId: selectedProcessoId } : null));
    setVinculadoSucesso(true);
    setTimeout(() => setVinculadoSucesso(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Caixa de Publicações (DJEN)"
        description="Comunicações e intimações judiciais capturadas automaticamente nos Diários de Justiça Eletrônicos."
        breadcrumbs={[{ label: 'Início', href: '/demo/processos' }, { label: 'Publicações' }]}
      />

      {/* Lista de Publicações */}
      <div className="space-y-3">
        {publicacoes.map((pub) => {
          const isSelected = selectedPub?.id === pub.id;
          return (
            <div
              key={pub.id}
              onClick={() => handleOpenPub(pub)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenPub(pub);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Publicação de ${pub.tribunal}, CNJ ${pub.numeroCnjCitado}`}
              className={cn(
                'p-4 rounded-[var(--radius-card)] border transition-all cursor-pointer select-none space-y-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                !pub.lida
                  ? 'bg-[var(--color-surface)] border-[var(--color-primary)]/40 shadow-sm'
                  : 'bg-[var(--color-surface)]/60 border-[var(--color-border)] opacity-85 hover:opacity-100',
                isSelected && 'ring-1 ring-[var(--color-glow)]'
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!pub.lida ? (
                    <Badge variant="warning" className="gap-1 py-0.2 px-2 text-[10px] font-mono">
                      <Clock className="h-3 w-3" />
                      Não Lida
                    </Badge>
                  ) : (
                    <Badge variant="neutro" className="gap-1 py-0.2 px-2 text-[10px] font-mono">
                      <CheckCircle className="h-3 w-3" />
                      Lida
                    </Badge>
                  )}
                  <span className="font-mono text-xs text-[var(--color-glow)]">
                    {pub.numeroCnjCitado}
                  </span>
                </div>
                <span className="text-xs text-[var(--color-muted)] font-mono">
                  {pub.dataDisponibilizacao}
                </span>
              </div>

              <div className="text-xs font-medium text-[var(--color-text)]">
                {pub.partesCitadas}
              </div>

              <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed">
                {pub.teorCompleto}
              </p>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--color-muted)]">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {pub.tribunal}
                </span>
                <span className="text-[var(--color-glow)] hover:underline inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Abrir leitura
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel Lateral de Leitura da Publicação */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="flex flex-col sm:max-w-lg w-full h-full p-0 bg-[var(--color-surface)] border-l border-[var(--color-border)]">
          {selectedPub && (
            <>
              <SheetHeader className="p-6 border-b border-[var(--color-border)] text-left shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  {!selectedPub.lida ? (
                    <Badge variant="warning" className="text-[10px]">Não Lida</Badge>
                  ) : (
                    <Badge variant="neutro" className="text-[10px]">Lida</Badge>
                  )}
                  <span className="text-xs text-[var(--color-muted)] font-mono">
                    {selectedPub.dataDisponibilizacao}
                  </span>
                </div>
                <SheetTitle className="text-base font-semibold text-[var(--color-text)]">
                  {selectedPub.tribunal}
                </SheetTitle>
                <SheetDescription className="text-xs font-mono text-[var(--color-glow)]">
                  Processo: {selectedPub.numeroCnjCitado}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm">
                <div>
                  <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1">
                    Partes Envolvidas
                  </h4>
                  <p className="font-medium text-xs text-[var(--color-text)]">
                    {selectedPub.partesCitadas}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5">
                    Teor Completo do Despacho
                  </h4>
                  <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-input)] text-xs text-[var(--color-text)] leading-relaxed font-mono whitespace-pre-wrap">
                    {selectedPub.teorCompleto}
                  </div>
                </div>

                {/* Vínculo a Processo */}
                <div className="p-4 bg-[var(--color-elevated)] border border-[var(--color-border)] rounded-[var(--radius-input)] space-y-2">
                  <h4 className="text-xs font-semibold text-[var(--color-text)] flex items-center gap-1.5">
                    <LinkIcon className="h-3.5 w-3.5 text-[var(--color-glow)]" />
                    Vincular a Processo em Monitoramento
                  </h4>
                  <p className="text-xs text-[var(--color-muted)]">
                    Associe esta comunicação aos autos correspondentes na base local.
                  </p>
                  <div className="flex gap-2">
                    <select
                      value={selectedProcessoId}
                      onChange={(e) => setSelectedProcessoId(e.target.value)}
                      className="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-input)] px-2 py-1.5 text-xs text-[var(--color-text)]"
                    >
                      {processos.slice(0, 10).map((proc) => (
                        <option key={proc.id} value={proc.id}>
                          {proc.cnj} — {proc.cliente}
                        </option>
                      ))}
                    </select>
                    <Button variant="secondary" size="sm" onClick={handleVincular} className="shrink-0 text-xs">
                      Vincular
                    </Button>
                  </div>
                  {vinculadoSucesso && (
                    <span className="text-[11px] text-[var(--color-success)] flex items-center gap-1 mt-1">
                      <CheckCircle className="h-3 w-3" />
                      Vínculo atualizado com sucesso!
                    </span>
                  )}
                </div>
              </div>

              <SheetFooter className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex-row justify-between items-center shrink-0">
                <Button
                  variant={selectedPub.lida ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={handleToggleLida}
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  {selectedPub.lida ? 'Marcar como Não Lida' : 'Marcar como Lida'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSheetOpen(false)}>
                  Fechar
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
