# Guia de Design — Protege ADV & Protege Empresa

## 1. Identidade Visual e Filosofia
O **Protege ADV & Protege Empresa** possui um design escuro premium com toques vibrantes em roxo/violeta, transmitindo seriedade jurídica, tecnologia de ponta, robustez e elegância de uma startup de alto nível.

- **Tema base:** Escuro (Dark Mode exclusivo).
- **Sem painéis com gráficos desnecessários:** Foco operacional e utilitário de alta produtividade (o sistema abre direto na caixa de entrada de Publicações).
- **Consistência visual:** Baseado em Tailwind CSS + shadcn/ui.

---

## 2. Paleta de Cores

### Tons de Fundo e Superfícies (Preto e Grafite Escuro)
- **Fundo Principal (Background):** `#090A0F` (Preto profundo com leve matiz índigo/roxo)
- **Superfície Secundária / Card (Surface):** `#11131C` (Cinza escuro acetinado)
- **Superfície Elevada / Hover (Elevated):** `#181B28`
- **Bordas Sutis (Borders):** `#222638`
- **Divisores e Linhas Guia:** `#1C2030`

### Cores de Destaque (Brand / Accent - Roxo Moderno)
- **Roxo Principal (Primary):** `#7C3AED` (Violet 600)
- **Roxo Interativo / Hover:** `#6D28D9` (Violet 700)
- **Roxo Brilhante (Glow / Highlights):** `#8B5CF6` (Violet 500)
- **Roxo Claro (Badges / Tags):** `#A78BFA` (Violet 400)
- **Fundo de Destaque Roxo Transparente:** `rgba(124, 58, 237, 0.12)`

### Cores de Apoio e Estados Semânticos
- **Sucesso / Em dia:** `#10B981` (Esmeralda) / `rgba(16, 185, 129, 0.15)`
- **Atenção / Aguardando atualização / Pendente:** `#F59E0B` (Âmbar) / `rgba(245, 158, 11, 0.15)`
- **Alerta / Erro / Prazo Vencido:** `#EF4444` (Vermelho) / `rgba(239, 68, 68, 0.15)`
- **Informativo / Neutro / Não monitorado:** `#64748B` (Slate) / `rgba(100, 116, 139, 0.15)`

### Tipografia e Cores de Texto
- **Texto Primário (Headings / Body Principal):** `#F8FAFC` (Slate 50)
- **Texto Secundário (Descrições / Metadados):** `#94A3B8` (Slate 400)
- **Texto Esmaecido (Placeholders / Dicas):** `#64748B` (Slate 500)
- **Família Tipográfica:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`
- **Monospace (Número CNJ, Códigos):** `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`

---

## 3. Componentes e Padrões de Interface

### 3.1 Cabeçalho e Barra Lateral
- **Sidebar colapsável:** Fundo `#0D0F18`, borda direita `#1C2030`.
- **Badges de contagem:** Ícones com badge numérica de itens não lidos (Publicações, Distribuições, Tarefas).
- **Atalhos rápidos:** Busca global e alternador de perfil/conta.

### 3.2 Listas e Tabelas de Processos e Publicações
- Linhas compactas com altura consistente, facilitando leitura de grande volume de dados.
- Destaque sutil no hover (`#181B28`).
- Badges com cantos arredondados (`rounded-md` ou `rounded-full`) com texto nítido.

### 3.3 Painel de Leitura Lateral (Drawer / Split View)
- Abertura suave ao clicar em publicações ou processos, sem perder o contexto da listagem.
- Divisão em duas colunas: listagem à esquerda (40%) e teor/detalhes à direita (60%).

### 3.4 Formulários e Modais
- Inputs com fundo `#11131C`, borda `#222638`, foco com anel roxo suave `ring-violet-500/30` e borda `border-violet-500`.
- Validação em tempo real com mensagens claras em vermelho suave.

---

## 4. Responsividade
- Interface 100% responsiva (Mobile first para leitura de avisos e publicações; otimizada para desktops para triagem em massa e trabalho de escritório).
- Menu gaveta inferior ou lateral em dispositivos móveis.
