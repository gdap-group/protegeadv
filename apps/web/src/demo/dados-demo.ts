import { validarNumeroCNJ } from '@protege/shared';

// Utilitários de cálculo de data relativa a hoje (para nunca parecer desatualizado)
export function diasRelativos(dias: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d;
}

export function formatarData(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(data: Date, hora: string = '09:00'): string {
  return `${formatarData(data)} às ${hora}`;
}

// Gerador de número CNJ válido segundo a Resolução 65 do CNJ
export function gerarCnjValido(n: number, aaaa: number, j: number, tr: number, oooo: number): string {
  const nPad = String(n).padStart(7, '0');
  const aaaaPad = String(aaaa).padStart(4, '0');
  const jPad = String(j);
  const trPad = String(tr).padStart(2, '0');
  const ooooPad = String(oooo).padStart(4, '0');
  const base = nPad + aaaaPad + jPad + trPad + ooooPad;
  const rem = BigInt(base + '00') % 97n;
  const d = 98n - rem;
  const dPad = String(d).padStart(2, '0');
  const cnj = `${nPad}-${dPad}.${aaaaPad}.${jPad}.${trPad}.${ooooPad}`;
  
  if (!validarNumeroCNJ(cnj)) {
    throw new Error(`CNJ gerado inválido: ${cnj}`);
  }
  return cnj;
}

export interface DemoAndamento {
  id: string;
  data: string;
  descricao: string;
  tipo: string;
}

export interface DemoPublicacaoItem {
  id: string;
  data: string;
  diario: string;
  teorResumo: string;
}

export interface DemoCompromissoItem {
  id: string;
  data: string;
  titulo: string;
  tipo: 'audiencia' | 'prazo' | 'pericia';
  status: 'pendente' | 'concluido' | 'vencido';
}

export interface DemoDocumentoItem {
  id: string;
  nome: string;
  tipo: string;
  tamanho: string;
  dataUpload: string;
}

export interface DemoProcesso {
  id: string;
  cnj: string;
  titulo: string;
  cliente: string;
  advogado: string;
  tribunal: string;
  vara: string;
  status: 'ativo' | 'suspenso' | 'arquivado';
  valorCausa: string;
  dataUltimoAndamento: string;
  temPrazoProximo: boolean;
  semAndamentoHa30Dias: boolean;
  resumo: string;
  andamentos: DemoAndamento[];
  publicacoes: DemoPublicacaoItem[];
  compromissos: DemoCompromissoItem[];
  documentos: DemoDocumentoItem[];
}

export interface DemoPublicacaoInbox {
  id: string;
  tribunal: string;
  dataDisponibilizacao: string;
  numeroCnjCitado: string;
  partesCitadas: string;
  teorCompleto: string;
  lida: boolean;
  processoId?: string;
}

export interface DemoPessoa {
  id: string;
  nome: string;
  tipo: 'pf' | 'pj';
  documentoMascarado: string;
  email: string;
  telefone: string;
  perfis: string[];
  processosIds: string[];
}

// ---------------------------------------------------------------------------
// 30 PROCESSOS FICTÍCIOS
// ---------------------------------------------------------------------------
const EMPRESAS_FICTICIAS = [
  'Horizonte Logística Integrada Ltda',
  'Vanguarda Automação Industrial S.A.',
  'Soluções Metálicas Meridional',
  'Nexus Distribuição de Alimentos',
  'Prisma Engenharia e Consultoria',
  'Aura Têxtil Catarinense Ltda',
  'Aliança Empreendimentos Imobiliários',
  'Pórtico Comércio Exterior S.A.',
  'Terra Nova Agropecuária e Sementes',
  'Delta Transportes e Cargas Eireli',
];

const ADVOGADOS_FICTICIOS = [
  'Dra. Camila Nogueira (OAB/MG 98.765)',
  'Dr. Rodrigo Fonseca (OAB/SP 142.330)',
  'Dra. Letícia Antunes (OAB/RJ 77.890)',
  'Dr. Gustavo Vasconcelos (OAB/PR 55.412)',
  'Dra. Juliana Peixoto (OAB/RS 83.190)',
];

const TRIBUNAIS = [
  { tr: 'TJMG', vara: '2ª Vara Cível da Comarca de Belo Horizonte', j: 8, cod: 13 },
  { tr: 'TJSP', vara: '14ª Vara da Fazenda Pública da Capital', j: 8, cod: 26 },
  { tr: 'TJRJ', vara: '5ª Vara Empresarial da Capital', j: 8, cod: 19 },
  { tr: 'TJPR', vara: '1ª Vara Cível de Curitiba', j: 8, cod: 16 },
  { tr: 'TRT3', vara: '8ª Vara do Trabalho de Belo Horizonte', j: 5, cod: 3 },
  { tr: 'TRF1', vara: '3ª Vara Federal Cível da SJMG', j: 4, cod: 1 },
];

export const DADOS_DEMO_PROCESSOS: DemoProcesso[] = Array.from({ length: 30 }, (_, index) => {
  const seq = index + 1;
  const trib = TRIBUNAIS[index % TRIBUNAIS.length]!;
  const cnj = gerarCnjValido(seq * 1357, 2024, trib.j, trib.cod, (seq * 3) % 900 + 100);
  const cliente = EMPRESAS_FICTICIAS[index % EMPRESAS_FICTICIAS.length]!;
  const advogado = ADVOGADOS_FICTICIOS[index % ADVOGADOS_FICTICIOS.length]!;

  // Regras de prazos e andamentos
  const temPrazoProximo = index % 4 === 0; // 8 processos com prazo próximo
  const semAndamentoHa30Dias = index % 5 === 1; // 6 processos parados há 30 dias

  const dataUltimoAndamento = semAndamentoHa30Dias
    ? formatarData(diasRelativos(-35 - (index * 2)))
    : formatarData(diasRelativos(-1 - (index % 5)));

  const status: 'ativo' | 'suspenso' | 'arquivado' =
    index === 28 || index === 29 ? 'suspenso' : 'ativo';

  return {
    id: `proc-${seq}`,
    cnj,
    titulo: `Ação ${index % 2 === 0 ? 'Declaratória de Inexistência de Débito' : 'Ordinária de Cobrança e Reparação'} nº ${seq}`,
    cliente,
    advogado,
    tribunal: trib.tr,
    vara: trib.vara,
    status,
    valorCausa: `R$ ${(45000 + (index * 12500)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    dataUltimoAndamento,
    temPrazoProximo,
    semAndamentoHa30Dias,
    resumo: `Ajuizada por ${cliente} em face de instituição de serviços terceirizados, visando a anulação de débitos cobrados indevidamente e a liberação de garantias prestadas em operação contratual. Tutela de urgência deferida provisoriamente.`,
    andamentos: [
      {
        id: `and-${seq}-1`,
        data: formatarDataHora(diasRelativos(-1), '14:22'),
        descricao: 'Juntada de petição de manifestação sobre laudo pericial.',
        tipo: 'Petição',
      },
      {
        id: `and-${seq}-2`,
        data: formatarDataHora(diasRelativos(-4), '10:05'),
        descricao: 'Publicação de despacho intimando as partes para especificação de provas.',
        tipo: 'Despacho',
      },
      {
        id: `and-${seq}-3`,
        data: formatarDataHora(diasRelativos(-12), '16:40'),
        descricao: 'Conclusão dos autos para decisão interlocutória do Magistrado.',
        tipo: 'Conclusão',
      },
      {
        id: `and-${seq}-4`,
        data: formatarDataHora(diasRelativos(-25), '09:15'),
        descricao: 'Audiência de tentativa de conciliação realizada sem acordo entre as partes.',
        tipo: 'Audiência',
      },
    ],
    publicacoes: [
      {
        id: `pub-item-${seq}-1`,
        data: formatarData(diasRelativos(-4)),
        diario: 'DJEN — Diário de Justiça Eletrônico Nacional',
        teorResumo: `Ficam as partes intimadas a apresentar rol de testemunhas no prazo legal de 15 dias úteis referente ao processo ${cnj}.`,
      },
      {
        id: `pub-item-${seq}-2`,
        data: formatarData(diasRelativos(-22)),
        diario: 'DJEN — Diário de Justiça Eletrônico Nacional',
        teorResumo: `Intimação sobre designação de audiência preliminar perante a ${trib.vara}.`,
      },
    ],
    compromissos: [
      {
        id: `comp-item-${seq}-1`,
        data: formatarData(diasRelativos(temPrazoProximo ? 3 : 15)),
        titulo: 'Apresentar Alegações Finais',
        tipo: 'prazo',
        status: 'pendente',
      },
      {
        id: `comp-item-${seq}-2`,
        data: formatarData(diasRelativos(temPrazoProximo ? 5 : 22)),
        titulo: 'Audiência de Instrução e Julgamento',
        tipo: 'audiencia',
        status: 'pendente',
      },
    ],
    documentos: [
      {
        id: `doc-${seq}-1`,
        nome: 'Peticao_Inicial_com_Documentos.pdf',
        tipo: 'Petição Inicial',
        tamanho: '4.2 MB',
        dataUpload: formatarData(diasRelativos(-40)),
      },
      {
        id: `doc-${seq}-2`,
        nome: 'Procuracao_e_Contrato_Social.pdf',
        tipo: 'Procuração',
        tamanho: '1.1 MB',
        dataUpload: formatarData(diasRelativos(-40)),
      },
      {
        id: `doc-${seq}-3`,
        nome: 'Manifestacao_Preliminar_Contestacao.pdf',
        tipo: 'Contestação',
        tamanho: '2.8 MB',
        dataUpload: formatarData(diasRelativos(-10)),
      },
    ],
  };
});

function getProc(idx: number): DemoProcesso {
  const p = DADOS_DEMO_PROCESSOS[idx];
  if (!p) throw new Error(`Processo não encontrado no índice ${idx}`);
  return p;
}

// ---------------------------------------------------------------------------
// PUBLICAÇÕES DA CAIXA DE ENTRADA (DJEN)
// ---------------------------------------------------------------------------
export const DADOS_DEMO_PUBLICACOES: DemoPublicacaoInbox[] = [
  {
    id: 'djen-pub-1',
    tribunal: 'TJMG — Diário de Justiça Eletrônico Nacional',
    dataDisponibilizacao: formatarDataHora(diasRelativos(0), '07:30'),
    numeroCnjCitado: getProc(0).cnj,
    partesCitadas: `${getProc(0).cliente} x Fundo Garantidor Alvorada`,
    teorCompleto: `COMARCA DE BELO HORIZONTE — 2ª VARA CÍVEL. Autos nº ${getProc(0).cnj}. Fica a parte autora intimada, por intermédio de seus patronos legalmente constituídos, para no prazo improrrogável de 15 (quinze) dias úteis apresentar manifestação sobre a contestação e documentos juntados retro, sob pena de preclusão. Publique-se. Registre-se. Cumpra-se.`,
    lida: false,
    processoId: getProc(0).id,
  },
  {
    id: 'djen-pub-2',
    tribunal: 'TJSP — Diário de Justiça Eletrônico Nacional',
    dataDisponibilizacao: formatarDataHora(diasRelativos(0), '08:15'),
    numeroCnjCitado: getProc(1).cnj,
    partesCitadas: `${getProc(1).cliente} x Fazenda Pública do Estado de São Paulo`,
    teorCompleto: `VARA DA FAZENDA PÚBLICA — Autos nº ${getProc(1).cnj}. Manifeste-se o autor em 10 dias a respeito da petição da Procuradoria do Estado requerendo a juntada de novos cálculos de atualização monetária.`,
    lida: false,
    processoId: getProc(1).id,
  },
  {
    id: 'djen-pub-3',
    tribunal: 'TRF1 — Diário de Justiça Eletrônico Nacional',
    dataDisponibilizacao: formatarDataHora(diasRelativos(-1), '18:00'),
    numeroCnjCitado: getProc(2).cnj,
    partesCitadas: `${getProc(2).cliente} x União Federal`,
    teorCompleto: `SUBSEÇÃO JUDICIÁRIA — 3ª VARA FEDERAL. Autos nº ${getProc(2).cnj}. Deferida a expedição do ofício requisitório precatório em favor da parte exequente. Vista às partes pelo prazo sucessivo de 5 dias.`,
    lida: false,
    processoId: getProc(2).id,
  },
  {
    id: 'djen-pub-4',
    tribunal: 'TRT3 — Diário de Justiça Eletrônico Nacional',
    dataDisponibilizacao: formatarDataHora(diasRelativos(-1), '19:45'),
    numeroCnjCitado: getProc(3).cnj,
    partesCitadas: `Marcos Vinícius Silveira x ${getProc(3).cliente}`,
    teorCompleto: `TRIBUNAL REGIONAL DO TRABALHO DA 3ª REGIÃO. Autos nº ${getProc(3).cnj}. Fica a reclamada intimada para comprovar nos autos os recolhimentos previdenciários acordados, no prazo de 8 dias.`,
    lida: false,
    processoId: getProc(3).id,
  },
  {
    id: 'djen-pub-5',
    tribunal: 'TJRJ — Diário de Justiça Eletrônico Nacional',
    dataDisponibilizacao: formatarDataHora(diasRelativos(-3), '11:20'),
    numeroCnjCitado: getProc(4).cnj,
    partesCitadas: `${getProc(4).cliente} x Companhia de Saneamento`,
    teorCompleto: `VARA EMPRESARIAL. Autos nº ${getProc(4).cnj}. Designada perícia técnica contábil a ser realizada pelo perito do juízo. Intimem-se os assistentes técnicos para formulação de quesitos.`,
    lida: true,
    processoId: getProc(4).id,
  },
  {
    id: 'djen-pub-6',
    tribunal: 'TJPR — Diário de Justiça Eletrônico Nacional',
    dataDisponibilizacao: formatarDataHora(diasRelativos(-5), '15:10'),
    numeroCnjCitado: getProc(5).cnj,
    partesCitadas: `${getProc(5).cliente} x Cooperativa Agroindustrial`,
    teorCompleto: `1ª VARA CÍVEL DE CURITIBA. Autos nº ${getProc(5).cnj}. Homologado o acordo celebrado entre as partes em audiência de mediação. Custas divididas igualmente.`,
    lida: true,
    processoId: getProc(5).id,
  },
  {
    id: 'djen-pub-7',
    tribunal: 'TJMG — Diário de Justiça Eletrônico Nacional',
    dataDisponibilizacao: formatarDataHora(diasRelativos(-7), '09:00'),
    numeroCnjCitado: getProc(6).cnj,
    partesCitadas: `${getProc(6).cliente} x Município de Nova Lima`,
    teorCompleto: `Autos nº ${getProc(6).cnj}. Intimação das partes da sentença proferida nos autos que julgou procedente o pedido deduzido na petição inicial.`,
    lida: true,
    processoId: getProc(6).id,
  },
];

// ---------------------------------------------------------------------------
// COMPROMISSOS DA AGENDA
// ---------------------------------------------------------------------------
export interface DemoAgendaEvento {
  id: string;
  data: Date;
  titulo: string;
  tipo: 'audiencia' | 'prazo' | 'pericia';
  status: 'pendente' | 'concluido' | 'vencido';
  cnj?: string;
  processoId?: string;
  cliente?: string;
  hora: string;
  detalhes: string;
}

export const DADOS_DEMO_AGENDA: DemoAgendaEvento[] = [
  {
    id: 'ag-1',
    data: diasRelativos(-2),
    titulo: 'Prazo: Contestação em Ação de Despejo',
    tipo: 'prazo',
    status: 'vencido', // Prazo vencido com destaque de ícone e texto
    cnj: getProc(0).cnj,
    processoId: getProc(0).id,
    cliente: getProc(0).cliente,
    hora: '18:00',
    detalhes: 'Prazo fatal para protocolo da contestação no PJe. Verificar se houve suspensão forense pelo tribunal.',
  },
  {
    id: 'ag-2',
    data: diasRelativos(0),
    titulo: 'Audiência de Conciliação e Mediação',
    tipo: 'audiencia',
    status: 'pendente',
    cnj: getProc(1).cnj,
    processoId: getProc(1).id,
    cliente: getProc(1).cliente,
    hora: '14:30',
    detalhes: 'Sessão telepresencial pela plataforma Zoom/Cisco do tribunal. Cliente já orientado sobre proposta.',
  },
  {
    id: 'ag-3',
    data: diasRelativos(2),
    titulo: 'Prazo: Réplica à Contestação e Impugnação',
    tipo: 'prazo',
    status: 'pendente',
    cnj: getProc(2).cnj,
    processoId: getProc(2).id,
    cliente: getProc(2).cliente,
    hora: '23:59',
    detalhes: 'Impugnação específica aos documentos anexados pela ré nas fls. 142/189.',
  },
  {
    id: 'ag-4',
    data: diasRelativos(5),
    titulo: 'Audiência de Instrução e Oitiva de Testemunhas',
    tipo: 'audiencia',
    status: 'pendente',
    cnj: getProc(3).cnj,
    processoId: getProc(3).id,
    cliente: getProc(3).cliente,
    hora: '10:00',
    detalhes: 'Sala 4 da 8ª Vara do Trabalho de Belo Horizonte. Comparecer acompanhado do preposto indicado.',
  },
  {
    id: 'ag-5',
    data: diasRelativos(9),
    titulo: 'Perícia Técnica Contábil In Loco',
    tipo: 'pericia',
    status: 'pendente',
    cnj: getProc(4).cnj,
    processoId: getProc(4).id,
    cliente: getProc(4).cliente,
    hora: '15:00',
    detalhes: 'Vistoria e coleta de extratos financeiros com o assistente técnico da empresa.',
  },
  {
    id: 'ag-6',
    data: diasRelativos(14),
    titulo: 'Prazo: Apelação Cível contra Sentença',
    tipo: 'prazo',
    status: 'pendente',
    cnj: getProc(5).cnj,
    processoId: getProc(5).id,
    cliente: getProc(5).cliente,
    hora: '23:59',
    detalhes: 'Elaboração das razões recursais e recolhimento do preparo em guia DAE.',
  },
];

// ---------------------------------------------------------------------------
// PESSOAS FICTÍCIAS
// ---------------------------------------------------------------------------
export const DADOS_DEMO_PESSOAS: DemoPessoa[] = [
  {
    id: 'pes-1',
    nome: 'Mariana Albuquerque Dias',
    tipo: 'pf',
    documentoMascarado: '142.***.***-89',
    email: 'mariana.albuquerque@exemplo.adv.br',
    telefone: '(31) 98765-4321',
    perfis: ['Cliente', 'Sócia Administradora'],
    processosIds: [getProc(0).id, getProc(1).id],
  },
  {
    id: 'pes-2',
    nome: 'Horizonte Logística Integrada Ltda',
    tipo: 'pj',
    documentoMascarado: '18.***.***/0001-42',
    email: 'juridico@horizonte-log.exemplo.com.br',
    telefone: '(31) 3456-7890',
    perfis: ['Cliente'],
    processosIds: [getProc(0).id, getProc(10).id, getProc(20).id],
  },
  {
    id: 'pes-3',
    nome: 'Dra. Camila Nogueira',
    tipo: 'pf',
    documentoMascarado: '078.***.***-15',
    email: 'camila.nogueira@protege-demo.adv.br',
    telefone: '(31) 99123-4567',
    perfis: ['Advogada Responsável'],
    processosIds: [getProc(0).id, getProc(2).id, getProc(4).id],
  },
  {
    id: 'pes-4',
    nome: 'Carlos Eduardo Meireles',
    tipo: 'pf',
    documentoMascarado: '331.***.***-62',
    email: 'carlos.meireles@exemplo.com.br',
    telefone: '(11) 97654-3210',
    perfis: ['Parte Contrária'],
    processosIds: [getProc(1).id],
  },
  {
    id: 'pes-5',
    nome: 'Vanguarda Automação Industrial S.A.',
    tipo: 'pj',
    documentoMascarado: '24.***.***/0001-90',
    email: 'diretoria@vanguarda-auto.exemplo.com',
    telefone: '(11) 4004-1234',
    perfis: ['Cliente'],
    processosIds: [getProc(1).id, getProc(11).id],
  },
  {
    id: 'pes-6',
    nome: 'Beatriz Fontes Vasconcelos',
    tipo: 'pf',
    documentoMascarado: '219.***.***-44',
    email: 'beatriz.fontes@exemplo.com',
    telefone: '(21) 98877-6655',
    perfis: ['Testemunha', 'Envolvida'],
    processosIds: [getProc(3).id],
  },
];
