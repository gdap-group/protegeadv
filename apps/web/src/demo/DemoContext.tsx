import * as React from 'react';
import {
  DADOS_DEMO_PROCESSOS,
  DADOS_DEMO_PUBLICACOES,
  DADOS_DEMO_AGENDA,
  DADOS_DEMO_PESSOAS,
  type DemoProcesso,
  type DemoPublicacaoInbox,
  type DemoAgendaEvento,
  type DemoPessoa,
  gerarCnjValido,
  formatarData,
} from './dados-demo';

export interface NovoProcessoInput {
  titulo: string;
  cliente: string;
  tribunal: string;
  vara: string;
  valorCausa: string;
}

export interface DemoContextType {
  processos: DemoProcesso[];
  publicacoes: DemoPublicacaoInbox[];
  agenda: DemoAgendaEvento[];
  pessoas: DemoPessoa[];
  unreadPublicacoesCount: number;
  marcarPublicacaoLida: (id: string, lida: boolean) => void;
  vincularPublicacaoProcesso: (publicacaoId: string, processoId: string) => void;
  adicionarProcesso: (novo: NovoProcessoInput) => DemoProcesso;
}

const DemoContext = React.createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [processos, setProcessos] = React.useState<DemoProcesso[]>(() => [...DADOS_DEMO_PROCESSOS]);
  const [publicacoes, setPublicacoes] = React.useState<DemoPublicacaoInbox[]>(() => [
    ...DADOS_DEMO_PUBLICACOES,
  ]);
  const [agenda] = React.useState<DemoAgendaEvento[]>(() => [...DADOS_DEMO_AGENDA]);
  const [pessoas] = React.useState<DemoPessoa[]>(() => [...DADOS_DEMO_PESSOAS]);

  const unreadPublicacoesCount = React.useMemo(
    () => publicacoes.filter((p) => !p.lida).length,
    [publicacoes]
  );

  const marcarPublicacaoLida = React.useCallback((id: string, lida: boolean) => {
    setPublicacoes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, lida } : item))
    );
  }, []);

  const vincularPublicacaoProcesso = React.useCallback(
    (publicacaoId: string, processoId: string) => {
      setPublicacoes((prev) =>
        prev.map((item) =>
          item.id === publicacaoId ? { ...item, processoId } : item
        )
      );
    },
    []
  );

  const adicionarProcesso = React.useCallback((novo: NovoProcessoInput): DemoProcesso => {
    const nextSeq = processos.length + 1;
    const cnj = gerarCnjValido(nextSeq * 9999, 2024, 8, 13, 24);
    const procCriado: DemoProcesso = {
      id: `proc-novo-${nextSeq}`,
      cnj,
      titulo: novo.titulo,
      cliente: novo.cliente,
      advogado: 'Dra. Camila Nogueira (OAB/MG 98.765)',
      tribunal: novo.tribunal || 'TJMG',
      vara: novo.vara || '1ª Vara Cível da Capital',
      status: 'ativo',
      valorCausa: novo.valorCausa || 'R$ 50.000,00',
      dataUltimoAndamento: formatarData(new Date()),
      temPrazoProximo: false,
      semAndamentoHa30Dias: false,
      resumo: `Processo cadastrado manualmente durante a demonstração. Ação em curso perante ${novo.tribunal}.`,
      andamentos: [
        {
          id: `and-novo-${Date.now()}`,
          data: `${formatarData(new Date())} às 10:00`,
          descricao: 'Distribuição dos autos e cadastramento no sistema.',
          tipo: 'Distribuição',
        },
      ],
      publicacoes: [],
      compromissos: [],
      documentos: [],
    };

    setProcessos((prev) => [procCriado, ...prev]);
    return procCriado;
  }, [processos.length]);

  return (
    <DemoContext.Provider
      value={{
        processos,
        publicacoes,
        agenda,
        pessoas,
        unreadPublicacoesCount,
        marcarPublicacaoLida,
        vincularPublicacaoProcesso,
        adicionarProcesso,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = React.useContext(DemoContext);
  if (!ctx) {
    throw new Error('useDemo deve ser usado dentro de um DemoProvider');
  }
  return ctx;
}

