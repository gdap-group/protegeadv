import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState, Button } from '../components/ui';
import { Plus, Users } from 'lucide-react';

export default function PessoasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pessoas"
        description="Cadastro unificado de clientes, partes contrárias, advogados e testemunhas."
        breadcrumbs={[{ label: 'Início', href: '/processos' }, { label: 'Pessoas' }]}
        action={
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Pessoa
          </Button>
        }
      />

      <EmptyState
        icon={<Users className="h-6 w-6" aria-hidden="true" />}
        title="Nenhuma pessoa cadastrada"
        description="Cadastre clientes e contatos para vinculá-los às pastas processuais e contratos."
      />
    </div>
  );
}

