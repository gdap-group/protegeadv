import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState, Button } from '../components/ui';
import { Plus, ScrollText } from 'lucide-react';

export default function ContratosPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Contratos"
        description="Contratos de honorários, controle de vigências e partes contratantes."
        breadcrumbs={[{ label: 'Início', href: '/processos' }, { label: 'Contratos' }]}
        action={
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-1.5" />
            Novo Contrato
          </Button>
        }
      />

      <EmptyState
        icon={<ScrollText className="h-6 w-6" aria-hidden="true" />}
        title="Nenhum contrato cadastrado"
        description="Formalize a prestação de serviços jurídicos e acompanhe vigências e reajustes."
      />
    </div>
  );
}

