# Guia de Design — Protege ADV & Protege Empresa

## 1. Identidade Visual e Filosofia
O **Protege ADV & Protege Empresa** possui um design escuro premium com toques vibrantes em roxo/violeta, transmitindo seriedade jurídica, tecnologia de ponta, robustez e elegância de uma startup de alto nível.

- **Tema base:** Escuro (Dark Mode exclusivo).
- **Sem painéis com gráficos desnecessários:** Foco operacional e utilitário de alta produtividade (o sistema abre direto na caixa de entrada de Publicações).
- **Consistência visual:** Baseado em Tailwind CSS + shadcn/ui.

---

## 2. Paleta de Cores e Tokens Oficiais (Fase 3 - Canônica)

Todas as cores vêm de variáveis em um único arquivo canônico (`apps/web/src/theme.css`):

### Tons de Fundo e Superfícies
- **Fundo Principal (`bg`):** `#0A0A0F` (`--color-bg`)
- **Superfície Secundária / Card (`surface`):** `#12121A` (`--color-surface`)
- **Superfície Elevada / Menus (`elevated`):** `#1A1A26` (`--color-elevated`)
- **Borda Sutil (`border`):** `rgba(255, 255, 255, 0.08)` (`--color-border`)

### Destaque e Ação (Roxo / Violeta)
- **Roxo Principal (`primary`):** `#8B5CF6` (`--color-primary`)
- **Roxo Interativo / Hover (`primary-hover`):** `#7C3AED` (`--color-primary-hover`)
- **Brilho Suave / Glow (`glow`):** `#A78BFA` (`--color-glow` / `--shadow-glow`)
- **Gradiente de Destaque:** De `#8B5CF6` (`--color-gradient-from`) para `#6366F1` (`--color-gradient-to`)

### Tipografia e Neutros
- **Texto Principal (`text`):** `#F4F4F8` (`--color-text`)
- **Texto Secundário (`muted`):** `#9CA3AF` (`--color-muted`)

### Estados Semânticos
- **Sucesso / Em dia (`success`):** `#34D399` (`--color-success`)
- **Atenção / Pendente (`warning`):** `#FBBF24` (`--color-warning`)
- **Alerta / Erro / Prazo Vencido (`danger`):** `#F87171` (`--color-danger`)

---

## 3. Tipografia, Forma e Movimento

### 3.1 Tipografia (@fontsource local)
- **Interface Geral:** `Inter` (pesos 400, 500, 600, 700) instalada localmente via `@fontsource/inter` (sem CDNs externas).
- **Códigos e Números CNJ:** `JetBrains Mono` (pesos 400, 500, 600) via `@fontsource/jetbrains-mono`.
- **Tamanhos e Pesos:** Corpo de 14px a 15px; Títulos em peso 600 (`font-semibold`).

### 3.2 Forma e Movimento
- **Raio de Cartões:** `12px` (`rounded-[var(--radius-card)]` / `12px`).
- **Raio de Campos de Entrada:** `8px` (`rounded-[var(--radius-input)]` / `8px`).
- **Espessura de Bordas:** `1px` (`border border-[var(--color-border)]`).
- **Sombras:** Exclusivamente como brilho roxo suave (`glow-card` / `box-shadow: 0 0 24px -4px rgba(167, 139, 250, 0.25)`).
- **Transições:** Entre `150ms` e `200ms` (`transition-all duration-150` ou `duration-200`).
- **Linhas de Tabela:** Altura padronizada de `44px` (`table-row-standard`).
- **Foco Acessível:** Foco visível em roxo em todos os elementos interativos (`:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }`).

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
