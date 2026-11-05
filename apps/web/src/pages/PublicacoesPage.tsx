import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState, Button } from '../components/ui';
import { RefreshCw, FileText } from 'lucide-react';

export default function PublicacoesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Publicações"
        description="Caixa de entrada com intimações capturadas automaticamente do DJEN."
        breadcrumbs={[{ label: 'Início', href: '/processos' }, { label: 'Publicações' }]}
        action={
          <Button variant="secondary">
            <RefreshCw className="h-4 w-4 mr-1.5" />
            Atualizar DJEN
          </Button>
        }
      />

      <EmptyState
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        title="Nenhuma publicação ainda"
        description="Assim que o diário oficial publicar intimações ligadas aos termos e OABs vigiados, elas aparecerão aqui."
      />
    </div>
  );
}

