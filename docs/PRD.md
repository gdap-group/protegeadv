# PRD — Protege ADV & Protege Empresa
Oct 8, 2026 · @Bananal pro

## 1. Visão geral
O Protege ADV é um sistema para advogados, escritórios e empresas acompanharem processos judiciais e publicações do diário oficial de forma automática. Ele busca as informações nas bases oficiais do CNJ (DataJud e DJEN), organiza tudo por processo e avisa a equipe no WhatsApp quando algo muda. O Protege Empresa é a mesma base voltada a empresas, que acompanham os processos em que são parte buscando pelo CNPJ.

**Problema.** Acompanhar processos exige conferir andamentos tribunal por tribunal e ler o diário oficial todos os dias para não perder prazo. Esse trabalho é manual, repetitivo e fácil de falhar.

**Objetivo.** Fazer essa conferência sozinho: cadastrar o processo pelo número, acompanhar andamentos e publicações pelas bases nacionais, ligar cada publicação ao processo certo e avisar a pessoa certa a tempo. O sistema atende vários escritórios e empresas ao mesmo tempo, cada um com seus dados isolados.

**Quem usa.** Advogados autônomos, escritórios com várias pessoas e equipes, e empresas com departamento jurídico.

### O que o sistema oferece
- Captura direta nas bases nacionais: DataJud para os processos e DJEN para as publicações.
- Acompanhamento de processos pelo número e descoberta de processos novos por nome, OAB ou CNPJ.
- Caixa de entrada de publicações, já ligadas ao processo certo.
- Agenda de prazos, audiências e atividades.
- Aviso por WhatsApp, e-mail e dentro do sistema.
- Cadastro de pessoas, documentos e modelos, e contratos de honorários.
- Vários escritórios e empresas na mesma plataforma, cada um com seus dados.

### Metas do produto
- Nenhuma publicação do DJEN ligada à OAB cadastrada deixa de aparecer na caixa de entrada.
- Todo processo monitorado é verificado no DataJud pelo menos uma vez por dia.
- Aviso no WhatsApp enviado em até 15 minutos depois que o sistema detecta a novidade.
- Cadastro de um processo novo em menos de um minuto, só com o número.

---

## 2. Escopo
O sistema reúne doze módulos. Processos (com Distribuições eletrônicas) e Publicações são o núcleo; os demais dão suporte a eles.

| Módulo | O que faz | Seção |
| :--- | :--- | :--- |
| Processos: pastas | Ficha de cada processo, com partes, andamentos, publicações, compromissos e documentos | 4 |
| Processos: busca automática | Cadastra o processo pelo número e acompanha pelo DataJud | 5 |
| Processos: distribuições eletrônicas | Avisa de processo novo envolvendo um nome ou uma OAB vigiados | 6 |
| Processos: relatório diário | Lista do que mexeu nos processos em cada dia | 8 |
| Publicações | Caixa de entrada com as publicações do diário oficial, ligadas ao processo | 7 |
| Agenda | Prazos, audiências e atividades, em calendário e kanban | 9 |
| Pessoas | Cadastro de clientes, partes, advogados e órgãos | 10 |
| GED | Arquivos em pastas e modelos de documento preenchidos automaticamente | 11 |
| Contratos de honorários | Contratos com clientes, vigência e aviso de vencimento | 12 |
| Protege Empresa | Monitoramento de processos por CNPJ | 13 |
| Avisos | WhatsApp, e-mail e sino dentro do sistema | 14 |
| Configurações e administração | Usuários, permissões, ajustes e controle das contas | 15 |

### Como o sistema se apresenta
- Não há painéis com gráficos: o sistema abre direto na caixa de entrada de Publicações, e o menu mostra o número de itens não lidos de cada módulo.
- Tudo que o sistema acompanha é processo; cada processo tem uma pasta.
- O sistema funciona em computador e em celular.

---

## 3. Perfis de usuário e permissões
O sistema atende três tipos de cliente (advogado autônomo, escritório com equipes e empresa) e quatro perfis de acesso dentro de cada conta.

### Tipos de conta
| Tipo | Quem é | O que usa |
| :--- | :--- | :--- |
| Escritório | Advogado autônomo ou escritório com várias pessoas e equipes | Todos os módulos |
| Empresa | Empresa que acompanha os próprios processos | Processos, Publicações, Pessoas, Agenda, GED e Protege Empresa (seção 13) |
| Administrador da plataforma | Equipe responsável pela plataforma | Cria contas, vê o estado das integrações, ajusta limites |

### Perfis de acesso dentro da conta
| Perfil | Pode | Não pode |
| :--- | :--- | :--- |
| Dono / administrador | Tudo da conta: usuários, permissões, integrações, configurações, todos os processos | Ver dados de outras contas |
| Advogado | Ver e editar os processos em que é responsável ou envolvido; ler publicações; usar agenda e GED | Mexer em usuários e configurações da conta |
| Estagiário / administrativo | Ver e editar o que o advogado liberar; criar compromissos e anexar arquivos | Excluir processo, ver contratos de honorários |
| Somente leitura | Consultar processos e publicações liberados | Qualquer alteração |

### Regras de permissão
- Cada usuário tem login próprio (e-mail e senha) e pertence a um ou mais grupos.
- O grupo define, por módulo, se o usuário pode ver, criar, editar e excluir.
- O dono pode limitar um usuário a ver só os processos em que está como responsável ou envolvido.
- O dono vê sempre tudo da conta.
- Os perfis acima são o ponto de partida: o dono pode ajustar as permissões de cada grupo.

---

## 4. Processos: pastas processuais
A pasta processual é a ficha de cada processo: dados, partes, andamentos, publicações, compromissos e arquivos num só lugar. Toda pasta está em um de três estados de monitoramento, e o sistema só atualiza sozinho as que estão monitoradas.

### 4.1 Lista de pastas
- **RF-PRO-01:** A lista mostra todas as pastas da conta que o usuário tem permissão de ver, com paginação.
- **RF-PRO-02:** Três filtros rápidos no topo, cada um com a contagem: Monitoramento em dia, Aguardando atualização e Não monitoradas. Ao lado, o total de processos monitorados.
- **RF-PRO-03:** Busca por número do processo, nome das partes, tribunal e outros campos de texto.
- **RF-PRO-04:** Busca avançada com filtros por status, natureza, tribunal, responsável, cliente, etiqueta, probabilidade e data de cadastro.
- **RF-PRO-05:** O usuário escolhe quais colunas aparecem na lista e a ordem (por data de cadastro, por última movimentação, por número).
- **RF-PRO-06:** O botão Adicionar abre as formas de cadastro: por número (seção 5), em lote por planilha e manual.
- **RF-PRO-07:** Ações em várias pastas de uma vez: trocar responsável, aplicar etiqueta, mudar status, ligar ou desligar monitoramento, arquivar.
- **RF-PRO-08:** Exportar a lista filtrada em planilha.

### 4.2 Ficha da pasta
| Campo | Origem | Observação |
| :--- | :--- | :--- |
| Número CNJ | Digitado | Validado pelo dígito verificador; único por conta |
| Tribunal, grau e órgão julgador | DataJud | Editável só se o usuário cadastrou manualmente |
| Classe e assunto | DataJud | Alimenta a "natureza" usada nos filtros |
| Data de ajuizamento e valor da causa | Data: DataJud. Valor: digitado | Pode ser corrigido na mão |
| Partes e advogados | DJEN e manual | Cada parte pode ser ligada a uma pessoa cadastrada |
| Cliente(s) | Escolhido pelo usuário | Liga a pasta ao cadastro de Pessoas |
| Responsáveis e envolvidos | Escolhido pelo usuário | Define quem vê e quem recebe aviso |
| Status | Usuário | Indefinido, ativo, suspenso, baixado, encerrado, arquivado |
| Probabilidade | Usuário | Escala de êxito (por exemplo, neutro, provável, remota) |
| Etiquetas | Usuário | Livres, com cor |
| Estado de monitoramento | Sistema | Em dia, aguardando atualização ou não monitorado |
| Observações | Usuário | Texto livre |

- **RF-PRO-09:** A ficha tem as abas Resumo, Andamentos, Publicações, Compromissos, Documentos e Histórico de alterações.
- **RF-PRO-10:** Andamentos é uma linha do tempo com tudo que já aconteceu no processo, do mais novo ao mais antigo. Cada item mostra data, descrição, origem (automático ou manual) e se já foi lido.
- **RF-PRO-11:** O usuário pode lançar um andamento manual (data, descrição) quando a informação não veio das bases oficiais.
- **RF-PRO-12:** Publicações mostra as publicações ligadas àquele processo, com acesso ao texto completo.
- **RF-PRO-13:** Compromissos mostra prazos, audiências e atividades ligados ao processo e deixa criar novos ali mesmo.
- **RF-PRO-14:** Documentos mostra os arquivos anexados ao processo e deixa subir novos (módulo GED, seção 11).
- **RF-PRO-15:** Histórico de alterações registra quem mudou o quê e quando, em qualquer campo editado na mão.

### 4.3 Estados de monitoramento
- **Monitoramento em dia:** a pasta está ligada e a última consulta ao DataJud deu certo dentro do prazo definido na configuração.
- **Aguardando atualização:** a pasta está ligada, mas a consulta falhou, está na fila ou passou do prazo.
- **Não monitorada:** o usuário não quer acompanhamento automático (processo arquivado, sigiloso ou fora do DataJud).
- **RF-PRO-16:** Processo em segredo de justiça ou fora da base do DataJud não some: a pasta fica criada, marcada como "não encontrado na base", e o usuário decide se mantém o monitoramento.
- **RF-PRO-17:** Excluir pasta exige confirmação e fica registrado no histórico da conta; a pasta vai para uma lixeira por 30 dias antes de sumir de vez.

---

## 5. Processos: busca automática (DataJud)
A busca automática transforma um número de processo em uma pasta preenchida e monitorada, sem o usuário digitar mais nada. A fonte é o DataJud, que traz os dados do processo e os movimentos, mas não traz nome das partes, documentos nem processos em segredo de justiça.

### 5.1 Cadastro por número
- **RF-BUS-01:** O usuário digita o número CNJ, com ou sem pontuação. O sistema valida o formato e o dígito verificador antes de buscar.
- **RF-BUS-02:** O sistema descobre o tribunal pelos dígitos do próprio número (ramo da Justiça e tribunal) e consulta o DataJud do tribunal certo. O usuário nunca escolhe o tribunal.
- **RF-BUS-03:** O usuário pode colar vários números de uma vez (um por linha) ou subir uma planilha com a coluna de números. Cada número vira um pedido de busca.
- **RF-BUS-04:** Na mesma tela o usuário já pode escolher cliente, responsáveis e etiquetas. No lote, o que ele escolher vale para todos os números.
- **RF-BUS-05:** Se o número já existe na conta, o sistema avisa e abre a pasta que já existe, sem duplicar.

### 5.2 Fila de buscas
| Estado | Significa |
| :--- | :--- |
| Em processamento | A consulta está na fila ou em andamento |
| Processada | Os dados foram encontrados e esperam o usuário abrir ou monitorar |
| Monitorando | A pasta foi criada e está sendo acompanhada |
| Não monitorada | Encontrada, mas o usuário não quer acompanhamento automático |
| Erro | A consulta falhou; mostra o motivo e o botão Tentar de novo |
| Arquivadas | Buscas encerradas que o usuário tirou da frente |

- **RF-BUS-06:** A tela tem um filtro por cada estado, busca por número e, em cada linha, as ações Abrir e Monitorar.
- **RF-BUS-07:** Número que o DataJud não conhece aparece como "não encontrado na base", com as opções de tentar de novo mais tarde ou manter a pasta só com dados manuais.
- **RF-BUS-08:** Falha temporária do DataJud (limite de uso ou erro do servidor) faz o sistema tentar de novo sozinho, esperando mais a cada tentativa. Passado o limite de tentativas, o pedido vai para Erro.

### 5.3 Atualização periódica
- **RF-BUS-09:** Todo processo monitorado é consultado de tempos em tempos. A frequência é configurável por conta; o padrão é uma vez por dia.
- **RF-BUS-10:** O sistema compara a data da última atualização informada pelo DataJud e só grava o que mudou. Cada movimento novo vira um andamento não lido na linha do tempo da pasta.
- **RF-BUS-11:** Andamento novo dispara os avisos configurados (seção 14).
- **RF-BUS-12:** O mesmo número pode ter registro em mais de um grau (primeira instância, recurso). O sistema junta tudo na mesma pasta e identifica o grau de cada andamento.
- **RF-BUS-13:** Processo sem andamento há mais dias do que o limite configurado fica marcado como parado e dispara o aviso de processo parado. O limite de dias é ajustável por conta.
- **RF-BUS-14:** Processo que deixa de responder por mais dias do que o limite vai para Aguardando atualização e avisa o responsável.
- **RF-BUS-15:** Quando os movimentos indicam baixa ou arquivamento, o sistema sugere mudar o status da pasta e pergunta; ele nunca muda o status sozinho.
- **RF-BUS-16:** O usuário pode pedir uma atualização na hora de uma pasta, sem esperar o ciclo.

---

## 6. Distribuições eletrônicas
Distribuições eletrônicas avisa quando aparece um processo novo envolvendo um nome ou uma OAB que o usuário está vigiando, antes mesmo de ele saber que o processo existe. O usuário cadastra o que quer vigiar, e o sistema joga cada processo novo numa caixa de entrada para triagem.

### 6.1 Monitoramentos (o que está sendo vigiado)
| Tipo de termo | Exemplo | Para que serve |
| :--- | :--- | :--- |
| Nome de pessoa ou empresa | Nome de um cliente, razão social | Achar processo novo contra ou a favor do cliente |
| Nome de advogado | Nome de um advogado do escritório | Achar processo novo em que ele foi constituído |
| Número de OAB com UF | Número e estado da OAB | Achar processo novo da carteira do advogado |

- **RF-DIS-01:** O usuário cadastra, edita, pausa e exclui monitoramentos. Cada um tem tipo, termo, nome interno, quem recebe o aviso e se está ativo.
- **RF-DIS-02:** Um monitoramento de nome aceita variações (razão social, nome fantasia, apelido) e palavras a ignorar, para cortar homônimos.
- **RF-DIS-03:** Um monitoramento de nome pode ser ligado a uma pessoa de Pessoas. Quando o processo for aceito, o cliente já vem preenchido na pasta.
- **RF-DIS-04:** Um monitoramento de OAB é ligado ao usuário advogado dono daquela OAB, que passa a ser responsável padrão das pastas aceitas.

### 6.2 Caixa de entrada
- **RF-DIS-05:** Duas abas: Caixa de entrada (para triar) e Arquivadas.
- **RF-DIS-06:** Cada item mostra número do processo, tribunal, classe, data em que apareceu, partes quando conhecidas, e o termo encontrado destacado no trecho onde apareceu.
- **RF-DIS-07:** Busca avançada por número, termo, tribunal, monitoramento de origem e intervalo de datas.
- **RF-DIS-08:** Quatro ações por item, também disponíveis em lote: Cadastrar e monitorar (cria a pasta pela busca automática), Vincular a uma pasta que já existe, Arquivar (não é do cliente, homônimo) e Marcar como lido.
- **RF-DIS-09:** Arquivar não apaga: o item pode voltar para a caixa de entrada.
- **RF-DIS-10:** Ao arquivar, o usuário pode marcar "ignorar esse processo para sempre", para ele não voltar quando houver nova publicação.

### 6.3 Regras
- Um processo que já tem pasta na conta nunca entra na caixa de entrada; o sistema liga a novidade à pasta existente.
- O mesmo processo achado por dois monitoramentos aparece uma vez só, com os dois termos listados.
- Cada item novo gera aviso para quem recebe o monitoramento (seção 14).
- O número de itens não lidos da caixa de entrada aparece no menu.

### 6.4 Limite da fonte
O DataJud não permite buscar por nome de parte nem por OAB. Por isso as distribuições são descobertas pelas comunicações do DJEN, que são pesquisáveis por nome da parte, nome do advogado e OAB. Na prática, o processo aparece quando sai a primeira comunicação dele no diário. Processos em segredo de justiça não aparecem.

---

## 7. Publicações (DJEN)
Publicações reúne, numa caixa de entrada só, tudo que sai no Diário de Justiça Eletrônico Nacional para as OABs, os advogados e os clientes da conta, já ligado ao processo certo. É o módulo em que o usuário mais vai ficar no dia a dia.

### 7.1 Captura
- **RF-PUB-01:** O sistema consulta o DJEN de tempos em tempos (padrão: de hora em hora, ajustável) e traz toda comunicação nova para cada termo ativo da conta.
- **RF-PUB-02:** Os termos vigiados são quatro: OAB de cada advogado, nome de advogado, nome de parte (clientes e empresas cadastradas) e número de cada processo monitorado.
- **RF-PUB-03:** Uma publicação achada por mais de um termo aparece uma vez só, com todos os termos listados. O sistema nunca grava a mesma comunicação duas vezes.
- **RF-PUB-04:** Na primeira vez que um termo é cadastrado, o sistema busca também o que saiu nos últimos dias, num período que o usuário escolhe (padrão: 30 dias), para não começar do zero.
- **RF-PUB-05:** Se a consulta ao DJEN falhar, o sistema tenta de novo e, ao voltar, busca o intervalo que ficou sem cobertura. Nenhum dia pode ficar sem consulta; o administrador da plataforma é avisado se isso estiver acontecendo.

### 7.2 Caixa de entrada
- **RF-PUB-06:** A tela tem a lista de publicações à esquerda e o texto para leitura à direita. Clicar numa publicação abre o teor sem sair da tela.
- **RF-PUB-07:** Três abas: Caixa de entrada (não tratadas), Não vinculadas (sistema não achou o processo) e Arquivadas.
- **RF-PUB-08:** Cada item da lista mostra data da publicação, tribunal e órgão, número do processo, tipo da comunicação, o termo achado e se já foi lida.
- **RF-PUB-09:** O painel de leitura mostra o teor completo, partes, advogados, o processo ligado (com atalho para a pasta) e os compromissos criados a partir dela.
- **RF-PUB-10:** Busca por texto e por cabeçalho. Busca avançada por tribunal, período, lida ou não lida, vinculada ou não, termo, responsável e etiqueta.
- **RF-PUB-11:** Ordenação por data de publicação, do mais novo ao mais antigo ou o contrário, e botão de atualizar a lista.

### 7.3 Vínculo com o processo
- **RF-PUB-12:** Quando o número do processo da publicação já tem pasta na conta, o vínculo é automático e a publicação aparece na aba Publicações da pasta.
- **RF-PUB-13:** Quando o número não tem pasta, a publicação vai para Não vinculadas com o botão Cadastrar processo, que roda a busca automática com aquele número e liga a publicação em seguida.
- **RF-PUB-14:** Quando a comunicação não traz número ou traz número que o sistema não entende, ela fica em Não vinculadas para o usuário escolher a pasta na mão.
- **RF-PUB-15:** O usuário pode desvincular e vincular a outra pasta. O relatório diário (seção 8) distingue vinculadas pelo sistema, vinculadas na mão e não vinculadas.

### 7.4 Ações sobre a publicação
- **RF-PUB-16:** Marcar como lida ou não lida, individualmente ou em lote. Ao abrir, a publicação é marcada como lida e o sistema guarda quem leu e quando.
- **RF-PUB-17:** Arquivar e desarquivar, individualmente ou em lote.
- **RF-PUB-18:** Criar compromisso a partir da publicação (prazo, audiência ou atividade), já ligado ao processo e com o texto da publicação como referência.
- **RF-PUB-19:** Ao criar um prazo, o sistema sugere a data final a partir da data da publicação, do número de dias e do tipo (dias úteis ou corridos), usando o calendário de feriados da conta. A data é sempre uma sugestão: o usuário confirma ou corrige, e o sistema nunca cria prazo sozinho.
- **RF-PUB-20:** Comentar internamente na publicação, para a equipe conversar sem sair dela.
- **RF-PUB-21:** Enviar a publicação por e-mail ou WhatsApp a um usuário ou a um contato, copiar o texto e exportar em PDF.

### 7.5 Regras
- O teor integral de toda publicação fica guardado no sistema, mesmo que o DJEN deixe de mostrá-la depois.
- Publicação nova gera aviso para os responsáveis do processo, ou para o dono da OAB quando não há pasta (seção 14).
- O número de não lidas da Caixa de entrada aparece no menu.

---

## 8. Relatório diário
O relatório diário responde, para um dia escolhido, "o que mexeu nos meus processos hoje". É uma lista simples do dia, sem gráficos.
- **RF-REL-01:** O usuário escolhe a data (padrão: hoje) e o sistema lista os processos que tiveram andamento ou publicação naquele dia.
- **RF-REL-02:** No topo, cinco contadores: andamentos automáticos, andamentos manuais, publicações vinculadas automaticamente, publicações vinculadas à mão e publicações não vinculadas. O contador de não vinculadas leva à aba Não vinculadas de Publicações.
- **RF-REL-03:** A lista mostra código da pasta, título (partes), última movimentação, tribunal, responsáveis e natureza. Clicar num processo mostra, ao lado, o que aconteceu nele naquele dia.
- **RF-REL-04:** Busca por texto e filtro pela data de processamento (o dia em que o sistema recebeu a informação), que pode ser diferente do dia em que o fato ocorreu.
- **RF-REL-05:** Cada usuário vê só os processos que tem permissão de ver; o dono vê todos.
- **RF-REL-06:** O relatório pode ser enviado todo dia, num horário escolhido, por e-mail ou WhatsApp ao usuário (resumo com os contadores e os processos do dia). Fica desligado por padrão.

---

## 9. Agenda
A agenda guarda tudo que tem data: prazos, audiências e atividades da equipe, ligados aos processos e vistos em calendário ou em quadro kanban. É o que garante que um prazo achado numa publicação não se perca.

### 9.1 Compromisso
| Campo | Detalhe |
| :--- | :--- |
| Título e descrição | Texto livre |
| Tipo | Prazo, audiência ou atividade |
| Data e hora | Dia inteiro ou com horário de início e fim |
| Responsáveis e envolvidos | Um ou mais usuários; define quem vê e quem recebe aviso |
| Processo | Opcional; liga ao processo e aparece na aba Compromissos da pasta |
| Origem | Criado na mão ou a partir de uma publicação |
| Status | Pendente, em andamento, concluído ou cancelado |
| Lembretes | Um ou mais avisos antes da data (seção 14) |
| Comentários | Conversa da equipe sobre o compromisso |

- **RF-AGE-01:** Criar, editar, concluir, cancelar e excluir compromisso. Concluir marca quem concluiu e quando.
- **RF-AGE-02:** Compromisso recorrente (por exemplo, toda segunda) com edição de só uma ocorrência ou de todas.
- **RF-AGE-03:** Compromisso de prazo vencido e não concluído fica destacado em vermelho na agenda e na pasta do processo.

### 9.2 Calendário
- **RF-AGE-04:** Visualizações por mês, semana, dia e lista.
- **RF-AGE-05:** Três filtros rápidos: Criados por mim, Sou envolvido e Do escritório. Busca por texto e busca avançada por tipo, status, processo, responsável e período.
- **RF-AGE-06:** Cada compromisso mostra no calendário o título, o tipo, os envolvidos e um atalho para marcar como concluído.
- **RF-AGE-07:** Arrastar um compromisso para outro dia ou horário reagenda, registrando a mudança no histórico.

### 9.3 Kanban
- **RF-AGE-08:** O quadro tem por padrão as colunas Pendente, Em andamento, Concluído e Cancelado, e o dono da conta pode criar, renomear e reordenar colunas.
- **RF-AGE-09:** Arrastar um cartão entre colunas muda o status do compromisso.
- **RF-AGE-10:** Os mesmos filtros e a mesma busca do calendário valem no kanban. O seletor no topo escolhe de quem é o quadro (do escritório ou de um usuário).

### 9.4 Calendário de feriados
- **RF-AGE-11:** A conta tem um calendário de feriados e dias sem expediente, pré-carregado com os feriados nacionais, em que o dono acrescenta feriados estaduais, municipais e suspensões de prazo por tribunal. Esse calendário é o que a sugestão de prazo da seção 7 usa.

---

## 10. Pessoas
Pessoas é o cadastro único de todo mundo que aparece no sistema: clientes, partes contrárias, advogados externos e órgãos. Uma pessoa cadastrada uma vez pode ser ligada a qualquer processo, monitoramento ou contrato.

### 10.1 Cadastro
| Campo | Detalhe |
| :--- | :--- |
| Tipo | Pessoa física ou jurídica |
| Nome ou razão social | Obrigatório; na pessoa jurídica, também nome fantasia |
| CPF ou CNPJ | Validado; único por conta |
| Perfil | Cliente, parte contrária, advogado, órgão ou outro; uma pessoa pode ter mais de um |
| Contatos | Telefones (com marcação de WhatsApp), e-mails e endereços |
| Outros nomes | Variações de nome, usadas pelos monitoramentos (seções 6 e 7) |
| Dados de pessoa física | Nome da mãe e do pai, data de nascimento, profissão, estado civil |
| Observações | Texto livre |
| Etiquetas | Livres, com cor |

- **RF-PES-01:** Criar, editar, arquivar e excluir pessoa. Excluir só é permitido se a pessoa não estiver ligada a nenhum processo; senão o sistema oferece arquivar.
- **RF-PES-02:** A lista tem filtro por Pessoa física e Pessoa jurídica, busca por nome, nome da mãe, nome do pai e observações, busca avançada por perfil e etiqueta, e colunas escolhidas pelo usuário (nome, tipo de pessoa, perfil, telefone).
- **RF-PES-03:** A ficha da pessoa tem as abas Dados, Processos (todos em que ela aparece, como cliente ou parte), Documentos, Contratos e Compromissos.
- **RF-PES-04:** Ao cadastrar uma pessoa jurídica, o sistema oferece ativar o monitoramento dela por CNPJ (seção 13).
- **RF-PES-05:** O sistema avisa de possível duplicidade quando o CPF, o CNPJ ou o nome já existem na conta.
- **RF-PES-06:** Importação de pessoas por planilha, com tela de conferência antes de gravar.
- **RF-PES-07:** Pessoas com perfil de órgão (varas, tribunais) podem ser cadastradas, para o usuário ligar o processo a elas quando quiser. Não é obrigatório, já que tribunal e órgão julgador vêm do DataJud.

---

## 11. GED: arquivos e modelos
O GED guarda os documentos da conta em pastas e gera documentos prontos a partir de modelos preenchidos com os dados do processo e da pessoa. Substitui a ida ao computador para montar uma procuração ou um contrato.

### 11.1 Arquivos
- **RF-GED-01:** Árvore de pastas à esquerda e conteúdo à direita, com visualização em ícones grandes ou em lista detalhada, ordenação por data de envio e busca por nome de pasta ou arquivo.
- **RF-GED-02:** Criar, renomear, mover e excluir pastas e arquivos. Upload de vários arquivos de uma vez, por botão ou arrastando.
- **RF-GED-03:** Arquivos anexados na aba Documentos de um processo, de uma pessoa ou de um contrato aparecem também numa pasta do GED criada automaticamente para aquele item.
- **RF-GED-04:** Pré-visualização no próprio sistema de PDF e imagens; os demais formatos são baixados.
- **RF-GED-05:** Subir um arquivo com o mesmo nome de um que já existe cria uma nova versão. O sistema guarda as versões anteriores e deixa baixar ou restaurar qualquer uma.
- **RF-GED-06:** Cada arquivo guarda quem enviou e quando, e pode receber etiquetas.
- **RF-GED-07:** Limite de tamanho por arquivo e de espaço por conta, configuráveis pelo administrador da plataforma. A conta vê quanto está usando.
- **RF-GED-08:** Documentos de um processo ou de uma pessoa só aparecem para quem tem permissão de ver aquele processo ou aquela pessoa.

### 11.2 Modelos de documento
| Tipo de modelo | Vem pronto no sistema |
| :--- | :--- |
| Contrato de honorários advocatícios | Sim, para pessoa física e para pessoa jurídica |
| Procuração | Sim, para pessoa física e para pessoa jurídica |
| Declaração de hipossuficiência | Sim |
| Outros (notificação, declaração, ofício) | O usuário cria |

- **RF-GED-09:** A lista de modelos mostra nome, módulo, tipo, proprietário (sistema ou conta) e última modificação, com busca por nome.
- **RF-GED-10:** Os modelos que vêm prontos são marcados como sugestão e não podem ser editados; o usuário faz uma cópia e edita a cópia.
- **RF-GED-11:** O editor de modelo é um editor de texto com formatação e campos variáveis (nome da pessoa, CPF ou CNPJ, endereço, número do processo, tribunal, partes, nome do escritório e do advogado, data).
- **RF-GED-12:** Gerar documento a partir de um modelo, dentro de uma pessoa ou de um processo: o sistema preenche os campos, mostra o resultado para o usuário conferir e salva o arquivo gerado (Word e PDF) na pasta do item.
- **RF-GED-13:** Campo variável sem dado cadastrado aparece destacado na conferência, para o usuário preencher na hora.

---

## 12. Contratos de honorários
Contratos guarda os contratos de honorários firmados com cada cliente, com as datas e o arquivo assinado, e avisa antes de um contrato vencer. Este módulo organiza o contrato; não faz cobrança nem lançamento de valores.

| Campo | Detalhe |
| :--- | :--- |
| Código | Gerado pelo sistema, único por conta |
| Contratantes | Uma ou mais pessoas cadastradas (os clientes) |
| Contratados | Um ou mais usuários ou advogados do escritório |
| Processos vinculados | Zero, um ou vários; o contrato aparece na ficha de cada um |
| Descrição | Texto livre sobre o objeto do contrato |
| Início, término e renovação | Datas; indica se renova sozinho |
| Responsáveis | Quem cuida do contrato dentro do escritório |
| Etiquetas | Livres, com cor |
| Arquivo | O contrato, gerado de um modelo do GED ou enviado pronto |

- **RF-CON-01:** Criar, editar, encerrar, arquivar e excluir contrato.
- **RF-CON-02:** A lista mostra código, contratados, contratantes, responsáveis e etiquetas, com busca por código da pasta, processo vinculado e descrição, e busca avançada por situação, período de vencimento e etiqueta.
- **RF-CON-03:** O contrato pode ser gerado direto de um modelo de contrato de honorários do GED (seção 11), já com as partes preenchidas.
- **RF-CON-04:** O sistema avisa os responsáveis com antecedência configurável (padrão: 30 e 7 dias) antes do vencimento (seção 14).
- **RF-CON-05:** Contratos vencidos ficam destacados na lista e numa situação própria (vencido), até o usuário renovar ou encerrar.
- **RF-CON-06:** Renovar cria nova vigência mantendo o histórico das anteriores.
- **RF-CON-07:** Quem não tem permissão de ver contratos não vê a lista nem o contrato dentro da ficha do processo ou da pessoa.

---

## 13. Protege Empresa (monitoramento por CNPJ)
O Protege Empresa deixa uma empresa acompanhar todos os processos em que é parte sem depender de escritório para avisar: ela cadastra o CNPJ, e o sistema vai atrás dos processos, acompanha os andamentos e avisa.

### 13.1 Como o sistema encontra os processos
O DataJud não busca por CNPJ nem por nome de parte, então a descoberta usa o DJEN, que busca por nome da parte, e depois entrega cada processo achado ao DataJud para o acompanhamento. Três caminhos alimentam a mesma lista:
1. Busca pelos nomes da empresa nas comunicações do DJEN (razão social, nome fantasia e variações).
2. Processos que a empresa já conhece, cadastrados por número ou por planilha.
3. Processos que o usuário puxa de uma publicação ou distribuição que chegou.

Com a fonte ampliada ligada na conta (seção 16.5), existe um quarto caminho: a busca direta pelo CNPJ, que traz também processos antigos e os que ainda não tiveram comunicação no diário. Cada processo achado por ele segue o mesmo fluxo de confirmação dos demais.

- **RF-EMP-01:** A empresa se cadastra com o CNPJ. O sistema valida o dígito verificador e preenche razão social e nome fantasia pela consulta pública de CNPJ, que o usuário confere e corrige.
- **RF-EMP-02:** O CNPJ raiz agrupa matriz e filiais: o usuário cadastra os CNPJs do grupo e todos aparecem na mesma conta, com filtro por empresa.
- **RF-EMP-03:** Cada CNPJ tem uma lista de nomes a vigiar (razão social, fantasia, siglas) e palavras a ignorar, igual aos monitoramentos da seção 6.
- **RF-EMP-04:** Ao ativar o monitoramento de um CNPJ, o sistema busca no DJEN o histórico dos últimos meses, num período que o usuário escolhe, e depois passa a buscar todo dia. Até onde o histórico alcança depende do que o DJEN mantém disponível.
- **RF-EMP-05:** Cada processo achado vai para a caixa de triagem da empresa (a mesma mecânica da seção 6.2), onde o usuário confirma que é da empresa ou descarta como homônimo.
- **RF-EMP-06:** Quando a fonte traz o CNPJ da parte na própria comunicação, o sistema usa o CNPJ para confirmar e pode cadastrar o processo sem triagem, se a empresa ligar a opção de cadastro automático. Por padrão a opção fica desligada.
- **RF-EMP-07:** Processo confirmado vira uma pasta normal (seção 4) e entra no ciclo de atualização do DataJud (seção 5).

### 13.2 O que a empresa vê
- **RF-EMP-08:** Em cada pasta, o polo da empresa (autora ou ré) e a empresa do grupo envolvida.
- **RF-EMP-09:** A lista de processos da empresa tem filtros por empresa do grupo, polo, status, tribunal, natureza, responsável e etiqueta, e mostra no topo a quantidade de processos de cada filtro.
- **RF-EMP-10:** Cada pasta tem um campo para o escritório ou advogado externo responsável (nome, e-mail e telefone), para a empresa saber a quem cobrar.
- **RF-EMP-11:** A empresa recebe os mesmos avisos de um escritório (seção 14): movimentação, publicação, prazo e processo parado.
- **RF-EMP-12:** Exportar a lista de processos da empresa em planilha, com os filtros aplicados.
- **RF-EMP-13:** A empresa usa o relatório diário, a agenda e o GED da mesma forma que o escritório.

### 13.3 Diferenças para a conta de escritório
- A conta de empresa não tem Contratos de honorários nem monitoramento por OAB.
- O usuário da empresa vê os processos de todos os CNPJs do grupo, a não ser que o dono limite por empresa.

---

## 14. Notificações e WhatsApp
O sistema avisa cada pessoa, no canal que ela escolheu, quando algo que é dela acontece: andamento novo, publicação, prazo chegando, processo parado. O WhatsApp é o canal principal; o sino dentro do sistema e o e-mail são os outros dois.

### 14.1 Eventos que geram aviso
| Evento | Quem recebe | Regra |
| :--- | :--- | :--- |
| Andamento novo em processo | Responsáveis e envolvidos da pasta | Um aviso por processo e por ciclo de atualização |
| Publicação nova | Responsáveis da pasta; sem pasta, o dono da OAB | Um aviso por publicação |
| Processo novo na caixa de distribuições | Quem recebe aquele monitoramento | Um aviso por processo |
| Prazo chegando | Responsáveis e envolvidos do compromisso | Antecedência configurável, mais um aviso no dia |
| Audiência chegando | Responsáveis e envolvidos do compromisso | Antecedência configurável |
| Compromisso atribuído a mim | A pessoa que recebeu | No momento em que é atribuído |
| Processo parado | Responsáveis da pasta | Quando passa do limite de dias (seção 5) |
| Pasta aguardando atualização | Responsáveis da pasta | Quando a consulta falha além do limite |
| Contrato vencendo | Responsáveis do contrato | 30 e 7 dias antes, ajustável |
| Relatório diário | Quem ligou | Horário escolhido (seção 8) |
| Falha de integração | Administrador da plataforma | DataJud, DJEN ou WhatsApp fora do ar |

### 14.2 Preferências
- **RF-NOT-01:** Cada usuário escolhe, para cada evento, por quais canais quer receber: WhatsApp, e-mail, sino ou nenhum.
- **RF-NOT-02:** O dono da conta define os padrões para os usuários novos e pode travar eventos obrigatórios, como prazo.
- **RF-NOT-03:** O usuário define um horário de silêncio no WhatsApp (por exemplo, das 22h às 7h). Os avisos desse intervalo saem no primeiro horário livre, exceto prazo que vence no mesmo dia.
- **RF-NOT-04:** Quando muitos eventos acontecem no mesmo ciclo, o sistema junta numa mensagem só ("12 andamentos novos em 9 processos") com o link para abrir, em vez de mandar uma por uma.
- **RF-NOT-05:** Antecedências de prazo e audiência são configuráveis por conta. Valor padrão: 3 dias antes e no dia.

### 14.3 WhatsApp
- **RF-NOT-06:** Os envios usam a API oficial do WhatsApp Business, por um número do sistema. As mensagens fora da janela de conversa são enviadas por modelos (templates) aprovados pela Meta.
- **RF-NOT-07:** Modelos previstos: andamento novo, publicação nova, processo novo na distribuição, prazo chegando, audiência chegando, compromisso atribuído, processo parado, contrato vencendo, resumo do dia.
- **RF-NOT-08:** A mensagem traz só o mínimo (tipo do aviso, número do processo e o link para abrir no sistema), nunca o teor da publicação nem dados do cliente, por causa do sigilo profissional e da LGPD.
- **RF-NOT-09:** Antes de receber qualquer aviso, o usuário confirma o próprio número: o sistema manda um código por WhatsApp e só ativa o canal depois da confirmação, que vale como autorização de recebimento.
- **RF-NOT-10:** O usuário pode parar de receber a qualquer momento, nas preferências ou respondendo "SAIR" à mensagem.
- **RF-NOT-11:** A resposta do usuário a um aviso não é atendida por chat: o sistema responde com o link para abrir o processo. Atendimento por conversa fica fora desta versão.

### 14.4 Sino e registro de envios
- **RF-NOT-12:** O sino mostra a lista de avisos do usuário, com lidos e não lidos, filtro por tipo e atalho para o item.
- **RF-NOT-13:** O sistema guarda um registro de envios (evento, destinatário, canal, hora e resultado: enviado, entregue, lido ou falhou) que o dono da conta consulta em Configurações.
- **RF-NOT-14:** Falha de envio no WhatsApp tenta de novo e, persistindo, cai para o e-mail (se o usuário tiver) e fica registrada.

---

## 15. Configurações e administração
Configurações é onde o dono da conta cuida de usuários, permissões e ajustes de cada módulo, e onde a equipe da plataforma cuida das contas.

### 15.1 Configurações da conta (dono)
| Área | O que o dono faz |
| :--- | :--- |
| Geral | Fuso horário (padrão: Brasília), formato de data, idioma (português do Brasil) |
| Escritório ou empresa | Nome, CNPJ, logotipo, endereço, contatos e as OABs do escritório |
| Usuários | Convidar por e-mail, editar, desativar, escolher grupo, informar OAB e telefone de WhatsApp |
| Grupos e permissões | Criar grupos e marcar, por módulo, ver, criar, editar e excluir |
| Cadastros personalizados | Listas da conta: etiquetas, status de processo, escala de probabilidade, naturezas, tipos de compromisso |
| Campos personalizados | Campos extras na pasta do processo e na ficha de pessoa (texto, número, data, lista) |
| Processos | Estados de processo, limite de dias para "processo parado" e "aguardando atualização" |
| Busca automática | Frequência da atualização (seção 5) |
| Distribuições eletrônicas | Monitoramentos, período da busca inicial, itens ignorados |
| Publicações | Termos vigiados, frequência da consulta, período da busca inicial |
| Agenda | Tipos de compromisso, colunas do kanban, calendário de feriados |
| Notificações | Padrões e eventos obrigatórios (seção 14) |
| Registros | Atividades (quem fez o quê e quando), envios de aviso e acessos (quem entrou e de onde) |
| Suporte | Abrir chamado ou falar com o suporte |

- **RF-CFG-01:** Cada usuário entra com e-mail e senha, pode trocar a senha e pode ligar a verificação em dois passos.
- **RF-CFG-02:** O dono pode exigir a verificação em dois passos de todos os usuários da conta.
- **RF-CFG-03:** Desativar um usuário tira o acesso na hora, mas mantém tudo que ele fez e permite reatribuir os processos e compromissos dele de uma vez.
- **RF-CFG-04:** O registro de atividades guarda criação, edição e exclusão de processos, pessoas, contratos, arquivos e permissões, e pode ser filtrado por usuário, módulo e período.
- **RF-CFG-05:** O registro de acessos guarda cada login com data, hora e endereço de rede, e mostra tentativas que falharam.

### 15.2 Administração da plataforma (equipe do sistema)
- **RF-ADM-01:** Criar, suspender e reativar contas de escritório e de empresa, e cadastrar o primeiro usuário dono.
- **RF-ADM-02:** Ligar e desligar módulos por conta (por exemplo, Protege Empresa só para quem contratou) e definir o limite de armazenamento e de processos monitorados.
- **RF-ADM-03:** Painel interno com o estado do DataJud, do DJEN e do WhatsApp (última consulta com sucesso, erros do dia, tamanho da fila) e lista de contas com problema.
- **RF-ADM-04:** Ver a fila de consultas e reprocessar uma consulta que falhou, de uma conta ou de todas.
- **RF-ADM-05:** Entrar numa conta para dar suporte somente com autorização do dono, e com o acesso registrado nos registros da conta.
- **RF-ADM-06:** Ver, por conta, a quantidade de usuários, de processos monitorados e o espaço de arquivos usado.

---

## 16. Integrações externas
O sistema depende de três fontes externas para funcionar, DataJud, DJEN e WhatsApp Business, e pode contar com uma quarta, opcional e paga, de dados judiciais ampliados (seção 16.5). Nenhuma delas deve derrubar o resto quando falhar. Cada uma entra por uma camada própria, que traduz o que a fonte devolve para o formato interno do sistema.

| Fonte | Para que serve | O que ela dá | O que ela não dá |
| :--- | :--- | :--- | :--- |
| DataJud (CNJ), API pública | Dados e andamentos dos processos monitorados | Número, tribunal, grau, órgão julgador, data de ajuizamento, classe, assuntos, nível de sigilo, movimentos com data, hora da última atualização | Nome das partes, CPF ou CNPJ, documentos, valor da causa, processos em segredo de justiça; busca por parte ou por OAB |
| DJEN (CNJ), comunicações | Publicações e descoberta de processos novos | Comunicações pesquisáveis por nome da parte, nome do advogado, número da OAB com UF e número do processo | Aviso por push: o sistema precisa perguntar de tempos em tempos |
| WhatsApp Business API | Avisos aos usuários | Envio por modelos aprovados, status de entrega | Conversa livre fora da janela de 24 horas sem modelo |
| E-mail transacional | Convites, recuperação de senha, avisos por e-mail | Envio com status | Não é caixa de entrada do usuário |
| Consulta pública de CNPJ | Preencher razão social e fantasia no cadastro | Dados cadastrais públicos | Garantia de disponibilidade; é só conveniência |
| Fonte ampliada paga (por exemplo Judit) | Cobrir o que DataJud e DJEN não dão: busca por CPF, CNPJ, OAB e nome, histórico e monitoramento de processos | Consulta por documento ou por número, partes, histórico e aviso de movimentação por webhook (depende do contrato) | Gratuidade: cada consulta tem custo. Respostas costumam ser assíncronas |
| Data Lake do CNJ (API) | Fonte nacional ampliada, a ser usada diretamente quando o acesso for obtido | Dados processuais mais completos do que o DataJud público (Resolução CNJ 574/2024) | Disponibilidade imediata: o meio de acesso e as condições ainda precisam ser confirmados com o CNJ |

### 16.1 Regras para todas as fontes
- **RF-INT-01:** Cada fonte tem um adaptador próprio. O resto do sistema conversa com o modelo interno (processo, andamento, publicação), nunca com o formato bruto da fonte. Trocar ou acrescentar uma fonte não muda as telas.
- **RF-INT-02:** Toda consulta roda numa fila de tarefas, com limite de requisições por segundo por fonte e tentativas automáticas com espera crescente. Nenhuma tela espera a consulta terminar.
- **RF-INT-03:** Cada consulta fica registrada (fonte, quando, quanto demorou, resultado), para o administrador da plataforma ver o que falhou.
- **RF-INT-04:** Tudo que entra é gravado de forma que receber o mesmo dado duas vezes não duplica nada (andamento, publicação, processo).
- **RF-INT-05:** Quando uma fonte está fora do ar, o sistema mostra aviso "dados atualizados até às HH:MM" nas telas afetadas e retoma sozinho depois, buscando o intervalo perdido.
- **RF-INT-06:** Chaves e credenciais (a chave pública do DataJud, o acesso ao WhatsApp, o envio de e-mail) ficam em configuração de ambiente, nunca no código, e podem ser trocadas sem publicar uma nova versão.

### 16.2 DataJud
- A autenticação usa uma chave pública publicada pelo CNJ, enviada no cabeçalho de cada chamada. O CNJ pode trocar essa chave, então o sistema lê a chave atual da configuração e o administrador atualiza quando ela mudar.
- Cada tribunal é um índice separado. O sistema escolhe o índice pelo número CNJ do processo (seção 5).
- Consultas grandes são paginadas por cursor, porque a busca comum para em 10 mil resultados.
- Limites de uso e atraso de atualização de cada tribunal não são especificados oficialmente. O sistema trata dados defasados como normais e usa a hora de atualização que a própria fonte informa.

### 16.3 DJEN
- Os filtros do DJEN funcionam de forma independente, um por vez. Por isso o sistema faz uma consulta por termo vigiado, não uma consulta combinada.
- A consulta de OAB aceita o número com a UF.
- Pontos conhecidos sobre o DJEN, a validar na implantação: não exige cadastro nem chave, aceita poucas consultas por segundo, devolve páginas de cerca de 50 itens e pode recusar acesso de fora do Brasil. Por isso o servidor do sistema fica hospedado no Brasil (seção 19).

### 16.4 WhatsApp Business
- O sistema precisa de uma conta Business verificada e de número próprio. A aprovação de cada modelo de mensagem pela Meta costuma levar de 24 a 48 horas e pode levar até uma semana; por isso os modelos da seção 14.3 devem ser enviados para aprovação logo no início.
- O custo por mensagem enviada é cobrado pela Meta ou pelo provedor escolhido.

### 16.5 Fonte ampliada: Data Lake do CNJ e serviço contratado
- **RF-INT-07:** Existe um adaptador de fonte ampliada. Trocar o Data Lake do CNJ por um serviço contratado, ou usar os dois, não muda nenhuma tela.
- **RF-INT-08:** A fonte paga vem desligada por padrão em cada conta e só é ligada por quem administra a plataforma.
- **RF-INT-09:** Toda consulta paga é registrada com o tipo de consulta, para o administrador acompanhar o custo. Cada conta tem um limite mensal de consultas pagas; ao chegar nele, o sistema para de consultar e avisa o dono da conta.
- **RF-INT-10:** Todo dado guarda a fonte de origem e a hora da coleta. Quando a fonte informa que o vínculo de uma parte com o processo foi deduzido e não confirmado, o sistema marca isso na tela.
- **RF-INT-11:** Respostas assíncronas da fonte ampliada chegam por webhook, com validação da origem; a consulta periódica fica de reserva caso o aviso não chegue.
- **RF-INT-12:** Sem a fonte ampliada o sistema funciona por completo com DataJud e DJEN, respeitando os limites já descritos nas seções 5, 6 e 13.
- **RF-INT-13:** Com a fonte ampliada ligada, o Protege Empresa pode descobrir processos pelo CNPJ e o Protege ADV pode listar processos pelo CPF/CNPJ de um cliente ou pela OAB, sempre entregando o resultado como pastas normais (seção 4).

---

## 17. Regras de negócio e fluxos principais
Quatro fluxos concentram quase tudo que o sistema faz sozinho: a chegada de uma publicação, a descoberta de um processo novo, o cadastro de um processo pelo número e o aviso de processo parado.

### 17.1 Chegada de uma publicação
Só a publicação com número de processo conhecido é ligada sozinha; o resto espera na aba Não vinculadas, para o usuário resolver.

### 17.2 Descoberta de um processo novo
Por padrão o sistema não cria pasta de processo achado por nome sem alguém confirmar, para não misturar homônimos.

### 17.3 Cadastro de um processo pelo número
1. O usuário digita o número, ou cola vários.
2. O sistema valida o formato e o dígito verificador e descobre o tribunal pelo próprio número.
3. Cria um pedido de busca Em processamento e coloca a consulta ao DataJud na fila.
4. Se achou, preenche a pasta e deixa no estado que o usuário escolheu (Processada ou Monitorando). Se não achou, marca "não encontrado na base".
5. Busca no DJEN as publicações que já existem para aquele número e liga todas à pasta.
6. Os andamentos que já existiam entram como lidos e sem aviso. Só o que aparecer depois dispara aviso.

### 17.4 Processo parado e consulta falha
1. A cada ciclo, o sistema confere a data do último andamento de cada pasta monitorada.
2. Passou do limite de dias da conta: marca a pasta como parada e avisa os responsáveis uma vez, não a cada ciclo.
3. Se a consulta ao DataJud falhou além do limite de tentativas, a pasta vai para Aguardando atualização e os responsáveis são avisados.
4. Quando a consulta volta a funcionar, a pasta volta para Em dia sozinha, sem novo aviso.

### 17.5 Regras que valem em todo o sistema
- A primeira carga não faz barulho: andamentos importados entram como lidos, e publicações da busca inicial entram na caixa de entrada sem aviso por WhatsApp.
- A atualização nunca apaga: se uma fonte deixar de mostrar um andamento ou uma publicação, o sistema mantém o que já guardou.
- Andamento lançado na mão e andamento automático convivem, e o manual nunca é sobrescrito.
- Prazo nunca é criado nem alterado sem a confirmação de um usuário.
- Permissão manda: ninguém vê nem recebe aviso de um processo que não tem permissão de ver.
- Publicação sem pasta vai para o advogado dono da OAB; se não houver dono, para o dono da conta.
- Datas são guardadas em horário universal e mostradas no fuso da conta.
- Exclusão vai para uma lixeira por 30 dias antes de ser definitiva, e fica no registro de atividades.

---

## 18. Modelo de dados
O sistema tem cerca de 25 entidades, e toda informação que pertence a um cliente carrega o identificador da conta dele (`conta_id`). Isso é o que mantém os dados de um escritório invisíveis para os outros.

| Entidade | Campos principais | Liga com |
| :--- | :--- | :--- |
| Conta | Tipo (escritório ou empresa), nome, CNPJ, fuso, módulos ativos, limites, situação | Tudo |
| Usuário | Nome, e-mail, WhatsApp confirmado, OAB e UF, verificação em dois passos, ativo | Conta, grupo |
| Grupo | Nome, permissões por módulo (ver, criar, editar, excluir) | Conta, usuários |
| Pessoa | Tipo PF ou PJ, nome, CPF ou CNPJ, perfis, contatos, outros nomes | Conta, processos, contratos |
| Empresa monitorada | CNPJ, razão social, fantasia, monitoramento ligado, cadastro automático | Conta, pessoa |
| Processo (pasta) | Número CNJ, tribunal, grau, órgão, classe, assuntos, ajuizamento, sigilo, status, probabilidade, estado de monitoramento, última atualização da fonte, último andamento | Conta, pessoas, andamentos, publicações |
| Parte do processo | Nome, polo, advogados, pessoa (opcional) | Processo, pessoa |
| Responsável do processo | Papel (responsável ou envolvido) | Processo, usuário |
| Andamento | Data e hora, código, descrição, grau, origem (automático ou manual), identificador da fonte | Processo, leituras |
| Publicação | Identificador da comunicação, tribunal, órgão, data, tipo, teor, número citado, situação, tipo de vínculo | Conta, processo, termos, leituras |
| Termo vigiado | Tipo (nome, advogado, OAB, CNPJ), valor, variações, palavras a ignorar, quem recebe, ativo, última consulta | Conta, usuário, pessoa |
| Distribuição | Número, tribunal, data, termo achado, situação (caixa, arquivada, ignorada) | Termos, processo |
| Pedido de busca | Número, estado, tentativas, erro, resultado | Conta, processo |
| Compromisso | Tipo, título, início, fim, dia inteiro, status, recorrência, lembretes | Processo, publicação de origem, envolvidos |
| Leitura | Quem leu e quando | Andamento ou publicação, usuário |
| Pasta e arquivo do GED | Nome, pasta mãe, versões, tamanho, enviado por | Processo, pessoa ou contrato |
| Modelo de documento | Nome, tipo, módulo, conteúdo, variáveis, dono (sistema ou conta) | Conta |
| Contrato | Código, início, término, renovação, situação | Contratantes, contratados, processos, arquivo |
| Etiqueta | Nome, cor | Processos, pessoas, contratos, arquivos, compromissos |
| Aviso | Evento, destinatário, canal, estado (enviado, entregue, lido, falhou), referência | Usuário, item de origem |
| Preferência de aviso | Evento, canais escolhidos | Usuário |
| Feriado | Data, abrangência (nacional, estado, município, tribunal) | Conta |
| Consulta externa | Fonte, alvo, início, duração, resultado | Conta |
| Registro de atividade | Quem, o quê, onde, quando | Conta, usuário |
| Registro de acesso | Login, data, hora, endereço, resultado | Conta, usuário |
| Campo personalizado | Entidade alvo, nome, tipo, valor | Conta |

### Regras do modelo
- Andamento e publicação guardam o identificador que a fonte deu a eles, e a combinação conta + identificador é única (RF-INT-04).
- O número CNJ é único por conta; contas diferentes podem ter o mesmo processo, cada uma com seus próprios dados.
- Excluir processo, pessoa ou contrato só marca como excluído por 30 dias.
- Nada que veio de fonte oficial é sobrescrito por edição manual: o valor digitado fica ao lado do valor da fonte.

---

## 19. Requisitos não funcionais e hospedagem
- **19.1 Arquitetura:** Usuário só conversa com a aplicação. Tarefas em segundo plano leem da fila, gravam no banco e respeitam limites. Suporte para até 30 mil pastas por conta, com 10 mil monitoradas.
- **19.2 Segurança:**
  - RNF-SEG-01: HTTPS, senhas com hash seguro.
  - RNF-SEG-02: Isolamento por conta (RLS obrigatório). Teste automatizado de cross-tenant isolation.
  - RNF-SEG-03: Bloqueio temporário pós-falhas de login, expiração de sessão.
  - RNF-SEG-04: Criptografia em repouso, segredos via env vars.
  - RNF-SEG-05: 2FA disponível.
- **19.3 LGPD e sigilo:**
  - RNF-LGPD-01 a 05: Termos de aceite, exportação de dados, sigilo em WhatsApp (sem teor/dados sensíveis), logs de acesso.
- **19.4 Desempenho e capacidade:** Listas abrem em até 2s com 10k itens; telas não bloqueiam por APIs externas; responsividade mobile e desktop.
- **19.5 Disponibilidade e backup:** 99% SLA mensal; recuperação automática de filas; backups diários com retenção 30 dias.
- **19.6 Qualidade e testes:** Cobertura de isolamento multi-tenant, duplicidade, cálculo de prazos, permissões e avisos.
- **19.7 Hospedagem:** Região Brasil.

---

## 20. Glossário
- **CNJ:** Conselho Nacional de Justiça.
- **Número CNJ:** Número único de 20 dígitos de cada processo; identifica o tribunal.
- **DataJud:** Base nacional do CNJ com dados e movimentos dos processos.
- **DJEN:** Diário de Justiça Eletrônico Nacional (intimações e comunicações).
- **Publicação:** Cada item que sai no DJEN.
- **Andamento:** Cada fato registrado no processo.
- **Pasta processual:** A ficha do processo no sistema.
- **Monitorar:** Consultas automáticas periódicas e alertas.
- **Distribuição:** Processo novo envolvendo nome ou OAB vigiados.
- **Polo:** Lado no processo (ativo/autor ou passivo/réu).
- **Segredo de justiça:** Processos não públicos.
- **Conta (multi-tenant):** Espaço isolado de cada escritório ou empresa (`conta_id`).
- **Webhook:** Notificação enviada por fonte externa.
