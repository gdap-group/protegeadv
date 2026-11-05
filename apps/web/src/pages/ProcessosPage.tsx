import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState, Button } from '../components/ui';
import { Plus, Briefcase } from 'lucide-react';

export default function ProcessosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Processos"
        description="Fichas de processos, andamentos do DataJud e controle de monitoramento."
        breadcrumbs={[{ label: 'Início', href: '/processos' }, { label: 'Processos' }]}
        action={
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-1.5" />
            Adicionar Processo
          </Button>
        }
      />

      <EmptyState
        icon={<Briefcase className="h-6 w-6" aria-hidden="true" />}
        title="Nenhum processo ainda"
        description="Cadastre o primeiro número CNJ para iniciar o acompanhamento automático de movimentações no DataJud."
        action={
          <Button variant="secondary" size="sm">
            Buscar no DataJud
          </Button>
        }
      />
    </div>
  );
}

