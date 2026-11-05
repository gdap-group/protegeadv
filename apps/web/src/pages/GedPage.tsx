import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState, Button } from '../components/ui';
import { Upload, FolderArchive } from 'lucide-react';

export default function GedPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="GED (Arquivos)"
        description="Gestão eletrônica de documentos, pastas e modelos automatizados."
        breadcrumbs={[{ label: 'Início', href: '/processos' }, { label: 'GED' }]}
        action={
          <Button variant="primary">
            <Upload className="h-4 w-4 mr-1.5" />
            Enviar Arquivo
          </Button>
        }
      />

      <EmptyState
        icon={<FolderArchive className="h-6 w-6" aria-hidden="true" />}
        title="Nenhum arquivo ou documento"
        description="Organize peças processuais e crie modelos com preenchimento automático."
      />
    </div>
  );
}

