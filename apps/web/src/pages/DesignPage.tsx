import { useEffect, useState } from 'react';

interface ColorToken {
  name: string;
  variable: string;
  description: string;
}

const COLOR_TOKENS: ColorToken[] = [
  { name: 'bg', variable: '--color-bg', description: 'Fundo principal da aplicação' },
  { name: 'surface', variable: '--color-surface', description: 'Superfície de cartões e painéis' },
  { name: 'elevated', variable: '--color-elevated', description: 'Superfície elevada, menus e dropdowns' },
  { name: 'border', variable: '--color-border', description: 'Bordas sutis translúcidas' },
  { name: 'primary', variable: '--color-primary', description: 'Roxo principal de ação e foco' },
  { name: 'primary-hover', variable: '--color-primary-hover', description: 'Estado hover de botões primários' },
  { name: 'glow', variable: '--color-glow', description: 'Brilho roxo suave e anéis de foco' },
  { name: 'gradient-from / primary', variable: '--color-gradient-from', description: 'Início do gradiente de destaque' },
  { name: 'gradient-to', variable: '--color-gradient-to', description: 'Fim do gradiente de destaque (índigo)' },
  { name: 'text', variable: '--color-text', description: 'Texto principal de alto contraste' },
  { name: 'muted', variable: '--color-muted', description: 'Texto secundário e descrições' },
  { name: 'success', variable: '--color-success', description: 'Estados de sucesso e em dia' },
  { name: 'warning', variable: '--color-warning', description: 'Estados de atenção e pendências' },
  { name: 'danger', variable: '--color-danger', description: 'Erros, prazos vencidos e alertas' },
];

export default function DesignPage() {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    const resolved: Record<string, string> = {};
    for (const token of COLOR_TOKENS) {
      resolved[token.variable] = computed.getPropertyValue(token.variable).trim();
    }
    setValues(resolved);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8 max-w-6xl mx-auto space-y-12">
      {/* Cabeçalho */}
      <header className="border-b border-[var(--color-border)] pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Design System — Protege ADV</h1>
            <p className="text-[var(--color-muted)] mt-1 text-sm">
              Rota de teste de design (/ _design) ativa exclusivamente em ambiente de desenvolvimento.
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-mono font-medium rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-glow)]">
            DEV ONLY
          </span>
        </div>
      </header>

      {/* 1. As 13 Cores Oficiais */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">1. Paleta de Cores do Sistema (13 Tokens)</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Todas as cores são lidas das variáveis canônicas em theme.css.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLOR_TOKENS.map((token) => (
            <div
              key={token.variable}
              className="p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center space-x-4"
            >
              <div
                className="w-12 h-12 rounded-[var(--radius-input)] border border-[var(--color-border)] shrink-0 shadow-sm"
                style={{ backgroundColor: `var(${token.variable})` }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm truncate">{token.name}</span>
                  <span className="text-xs font-mono text-[var(--color-glow)]">
                    {values[token.variable] || 'lendo...'}
                  </span>
                </div>
                <p className="text-xs text-[var(--color-muted)] truncate mt-0.5 font-mono">
                  var({token.variable})
                </p>
                <p className="text-xs text-[var(--color-muted)] truncate mt-0.5">
                  {token.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Escala Tipográfica */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">2. Escala Tipográfica (@fontsource)</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Inter para interface (corpo 14-15px, títulos peso 600) e JetBrains Mono para códigos e números processuais.
          </p>
        </div>

        <div className="p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-6">
          <div className="space-y-2 border-b border-[var(--color-border)] pb-4">
            <h3 className="text-2xl font-semibold font-sans">Título H1 / 24px — Painel de Publicações (Inter Semibold 600)</h3>
            <h4 className="text-lg font-semibold font-sans">Título H2 / 18px — Processo Judicial nº 0001234-56.2026.8.26.0100</h4>
            <p className="text-sm font-sans text-[var(--color-text)]">
              Corpo de texto 14px (Inter Regular 400): Acompanhamento processual unificado com intimações capturadas automaticamente do DJEN e DataJud.
            </p>
            <p className="text-[15px] font-sans text-[var(--color-muted)]">
              Corpo de texto secundário 15px (Inter 400 Muted): Monitoramento ativo em 42 processos judiciais no Tribunal de Justiça de São Paulo.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[var(--color-glow)]">
              Tipografia Monoespaçada (JetBrains Mono)
            </span>
            <div className="p-3 rounded-[var(--radius-input)] bg-[var(--color-elevated)] border border-[var(--color-border)] font-mono text-sm space-y-1">
              <div>Número CNJ: <span className="text-[var(--color-glow)]">5001234-89.2026.4.03.6100</span></div>
              <div>ID do Contrato: <span className="text-[var(--color-muted)]">c7f21a80-14e3-4f9e-a81d-842df2920e4b</span></div>
              <div>Hash de Auditoria: <span className="text-[var(--color-muted)]">sha256:e3b0c44298fc1c149afbf4c8996fb924</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Forma e Movimento: Cartão com Brilho, Botão Gradiente e Foco */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">3. Forma, Brilho, Gradiente e Foco Visível</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Raio de 12px em cartões, 8px em campos, foco roxo visível e transições suaves de 150 a 200 ms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cartão com Brilho (Glow) */}
          <div className="p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] glow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--color-glow)]">
                Exemplo de Cartão com Brilho (Glow)
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)]" />
            </div>
            <h3 className="text-lg font-semibold">Cartão com Raio de 12px e Borda Sutil</h3>
            <p className="text-sm text-[var(--color-muted)]">
              Este cartão utiliza a classe glow-card com sombra roxa suave (box-shadow) e fundo surface.
            </p>
            <div className="pt-2">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-[var(--radius-input)] font-medium text-sm text-[var(--color-text)] bg-gradient-to-r from-[var(--color-gradient-from)] to-[var(--color-gradient-to)] transition-all duration-150 hover:brightness-110 active:scale-[0.99] cursor-pointer"
              >
                Botão com Gradiente de Destaque
              </button>
            </div>
          </div>

          {/* Teste de Foco em Elementos Interativos */}
          <div className="p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
            <span className="text-xs uppercase tracking-wider font-semibold text-[var(--color-glow)]">
              Teste de Foco Visível em Roxo (:focus-visible)
            </span>
            <p className="text-sm text-[var(--color-muted)]">
              Pressione Tab para navegar e confirmar o anel de foco roxo (primary com outline 2px).
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="test-input" className="block text-xs font-medium text-[var(--color-muted)] mb-1">
                  Campo de Texto (Raio 8px)
                </label>
                <input
                  id="test-input"
                  type="text"
                  placeholder="Clique aqui e pressione Tab..."
                  className="w-full px-3 py-2 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text)] placeholder-[var(--color-muted)] text-sm transition-all duration-150"
                />
              </div>

              <div className="flex space-x-3 pt-1">
                <button
                  type="button"
                  className="px-4 py-2 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-elevated)] text-[var(--color-text)] text-sm font-medium transition-all duration-150 hover:bg-[var(--color-surface)] cursor-pointer"
                >
                  Botão Secundário
                </button>
                <a
                  href="#test-link"
                  className="inline-flex items-center px-4 py-2 rounded-[var(--radius-input)] text-sm text-[var(--color-glow)] hover:underline"
                >
                  Link com Foco Roxo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Linha de Tabela com Altura Padrão (44px) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">4. Tabela com Altura Padronizada de 44px</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Linhas densas otimizadas para leitura profissional de processos e intimações.
          </p>
        </div>

        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-elevated)] text-xs uppercase tracking-wider text-[var(--color-muted)] table-row-standard">
                <th className="px-4">Processo</th>
                <th className="px-4">Tribunal</th>
                <th className="px-4">Status</th>
                <th className="px-4 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr className="table-row-standard hover:bg-[var(--color-elevated)] transition-colors duration-150">
                <td className="px-4 font-mono text-[var(--color-glow)]">0001234-56.2026.8.26.0100</td>
                <td className="px-4">TJSP - 1ª Vara Cível</td>
                <td className="px-4">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-elevated)] text-[var(--color-success)] border border-[var(--color-border)]">
                    Ativo
                  </span>
                </td>
                <td className="px-4 text-right font-mono text-xs text-[var(--color-muted)]">05/11/2026</td>
              </tr>
              <tr className="table-row-standard hover:bg-[var(--color-elevated)] transition-colors duration-150">
                <td className="px-4 font-mono text-[var(--color-glow)]">5004321-12.2026.4.03.6100</td>
                <td className="px-4">TRF-3 - 4ª Vara Federal</td>
                <td className="px-4">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--color-elevated)] text-[var(--color-warning)] border border-[var(--color-border)]">
                    Prazo Pendente
                  </span>
                </td>
                <td className="px-4 text-right font-mono text-xs text-[var(--color-muted)]">04/11/2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
