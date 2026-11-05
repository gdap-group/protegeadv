import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui';
import { Settings } from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Parâmetros da conta, permissões de usuários e integrações com WhatsApp e tribunais."
        breadcrumbs={[{ label: 'Início', href: '/processos' }, { label: 'Configurações' }]}
      />

      <EmptyState
        icon={<Settings className="h-6 w-6" aria-hidden="true" />}
        title="Configurações da conta"
        description="Gerencie grupos de acesso, parâmetros de alerta no WhatsApp e chaves de integração."
      />
    </div>
  );
}

