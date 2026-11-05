import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState, Button } from '../components/ui';
import { Plus, Calendar } from 'lucide-react';

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda"
        description="Controle de prazos, audiências e compromissos processuais em calendário e kanban."
        breadcrumbs={[{ label: 'Início', href: '/processos' }, { label: 'Agenda' }]}
        action={
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-1.5" />
            Novo Compromisso
          </Button>
        }
      />

      <EmptyState
        icon={<Calendar className="h-6 w-6" aria-hidden="true" />}
        title="Nenhum compromisso agendado"
        description="Cadastre prazos fatais e audiências para receber avisos antes do vencimento."
      />
    </div>
  );
}

