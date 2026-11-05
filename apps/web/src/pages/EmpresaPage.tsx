import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState, Button } from '../components/ui';
import { Plus, Building2 } from 'lucide-react';

export default function EmpresaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Protege Empresa"
        description="Monitoramento ativo de processos por CNPJ, filiais e marcas."
        breadcrumbs={[{ label: 'Início', href: '/processos' }, { label: 'Protege Empresa' }]}
        action={
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-1.5" />
            Adicionar CNPJ
          </Button>
        }
      />

      <EmptyState
        icon={<Building2 className="h-6 w-6" aria-hidden="true" />}
        title="Nenhuma empresa monitorada"
        description="Cadastre a razão social e CNPJs da sua empresa para monitorar processos em que figure como parte."
      />
    </div>
  );
}

