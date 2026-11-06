import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Clock,
  History,
  FolderOpen,
  Calendar,
} from 'lucide-react';
import { PaginaDetalhe, type DetalheTab } from '../components/patterns/PaginaDetalhe';
import { Button } from '../components/ui/button';
import { useDemo } from './DemoContext';

export function DemoProcessoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { processos } = useDemo();

  const processo = processos.find((p) => p.id === id) ?? processos[0];

  if (!processo) {
    return (
      <div className="p-8 text-center">
        <p className="text-[var(--color-muted)]">Processo não encontrado.</p>
        <Link to="/demo/processos" className="text-[var(--color-glow)] hover:underline mt-2 inline-block">
          Voltar para a listagem
        </Link>
      </div>
    );
  }

  const tabs: DetalheTab[] = [
    {
      id: 'resumo',
      label: 'Resumo',
      icon: FileText,
      content: (
        <div className="space-y-4 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Síntese dos Autos</h2>
            <p className="text-sm text-[var(--color-muted)] mt-1.5 leading-relaxed">
              {processo.resumo}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--color-border)] text-xs">
            <div>
              <span className="text-[var(--color-muted)] block">Rito Processual:</span>
              <span className="font-medium text-[var(--color-text)]">Procedimento Comum Cível</span>
            </div>
            <div>
              <span className="text-[var(--color-muted)] block">Fase Atual:</span>
              <span className="font-medium text-[var(--color-text)]">Instrução Probatória</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'andamentos',
      label: 'Andamentos',
      count: processo.andamentos.length,
      icon: History,
      content: (
        <div className="space-y-3 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
            Histórico Cronológico de Andamentos
          </h2>
          <div className="space-y-3 font-mono text-xs">
            {processo.andamentos.map((and) => (
              <div
                key={and.id}
                className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-input)] flex flex-col gap-1"
              >
                <div className="flex items-center justify-between text-[var(--color-glow)]">
                  <span>{and.data}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--color-elevated)] border border-[var(--color-border)] uppercase">
                    {and.tipo}
                  </span>
                </div>
                <p className="text-xs font-sans text-[var(--color-text)] mt-1">
                  {and.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'publicacoes',
      label: 'Publicações',
      count: processo.publicacoes.length,
      icon: Clock,
      content: (
        <div className="space-y-3 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
            Intimações e Diários Oficiais (DJEN)
          </h2>
          {processo.publicacoes.length === 0 ? (
            <p className="text-xs text-[var(--color-muted)]">Nenhuma publicação associada.</p>
          ) : (
            processo.publicacoes.map((pub) => (
              <div
                key={pub.id}
                className="p-3.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-input)] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs text-[var(--color-glow)] font-mono">
                  <span>{pub.data}</span>
                  <span className="text-[11px] text-[var(--color-muted)]">{pub.diario}</span>
                </div>
                <p className="text-xs text-[var(--color-text)] leading-relaxed">
                  {pub.teorResumo}
                </p>
              </div>
            ))
          )}
        </div>
      ),
    },
    {
      id: 'compromissos',
      label: 'Compromissos',
      count: processo.compromissos.length,
      icon: Calendar,
      content: (
        <div className="space-y-3 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
            Audiências e Prazos do Processo
          </h2>
          {processo.compromissos.map((comp) => (
            <div
              key={comp.id}
              className="p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-input)] flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-[var(--color-text)] block">
                  {comp.titulo}
                </span>
                <span className="text-xs text-[var(--color-muted)] font-mono">
                  Data limite: {comp.data}
                </span>
              </div>
              <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-[var(--color-elevated)] text-[var(--color-glow)] border border-[var(--color-border)]">
                {comp.tipo.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'documentos',
      label: 'Documentos',
      count: processo.documentos.length,
      icon: FolderOpen,
      content: (
        <div className="space-y-3 p-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)]">
          <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">
            Peças e Anexos Digitais (GED)
          </h2>
          <div className="space-y-2">
            {processo.documentos.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-input)]"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-[var(--color-glow)] shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-[var(--color-text)] block">
                      {doc.nome}
                    </span>
                    <span className="text-[11px] text-[var(--color-muted)]">
                      {doc.tipo} &bull; {doc.tamanho} &bull; Upload em {doc.dataUpload}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  Baixar
                </Button>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PaginaDetalhe
        title={processo.titulo}
        codigoMono={processo.cnj}
        breadcrumbs={[
          { label: 'Processos', href: '/demo/processos' },
          { label: processo.cnj },
        ]}
        status={{
          label: processo.status === 'ativo' ? 'Monitoramento Ativo' : 'Suspenso',
          variant: processo.status === 'ativo' ? 'success' : 'warning',
          icon: processo.status === 'ativo' ? CheckCircle2 : AlertTriangle,
        }}
        actions={
          <Link to="/demo/processos">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Voltar para Lista
            </Button>
          </Link>
        }
        tabs={tabs}
        sideTitle="Metadados dos Autos"
        sideItems={[
          { label: 'Cliente / Representado', value: processo.cliente },
          { label: 'Advogado Responsável', value: processo.advogado },
          { label: 'Tribunal / Órgão', value: processo.tribunal },
          { label: 'Vara / Comarca', value: processo.vara },
          { label: 'Valor da Causa', value: processo.valorCausa },
          { label: 'Último Andamento Registrado', value: processo.dataUltimoAndamento },
        ]}
      />
    </div>
  );
}
