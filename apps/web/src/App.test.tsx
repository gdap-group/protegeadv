// @vitest-environment jsdom
import './test/setup';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
}

describe('App e TooltipProvider Global (sem tela preta)', () => {
  const originalLocation = window.location;

  const originalDemoVal = import.meta.env.VITE_MODO_DEMO;

  beforeEach(() => {
    localStorage.clear();
    setViewportWidth(1280);
    window.history.pushState({}, '', '/processos');
    // @ts-expect-error restaurando padrão
    import.meta.env.VITE_MODO_DEMO = originalDemoVal;
  });

  afterEach(() => {
    localStorage.clear();
    // @ts-expect-error restaurando padrão
    import.meta.env.VITE_MODO_DEMO = originalDemoVal;
    vi.restoreAllMocks();
  });

  it('renderiza /processos em desktop (1280px) com sidebar recolhida (usando Tooltip) sem lançar erro', async () => {
    // Configura o menu como recolhido no localStorage para forçar o uso de Tooltip
    localStorage.setItem('protege_sidebar_collapsed', 'true');
    const user = userEvent.setup();

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Processos' })).toBeInTheDocument();

    // Com o menu recolhido, os links têm tooltip acoplado
    const processoLink = screen.getByRole('link', { name: 'Processos' });
    expect(processoLink).toBeInTheDocument();

    // Passa o mouse e foca no item com tooltip
    await user.hover(processoLink);
    processoLink.focus();
    expect(processoLink).toHaveFocus();
  });

  it('renderiza /processos em mobile (376px) com sidebar desktop montada recolhida e abre gaveta sem erro de TooltipProvider', async () => {
    // Cenário exato do defeito reportado: largura estreita 376px com sidebar recolhida
    setViewportWidth(376);
    localStorage.setItem('protege_sidebar_collapsed', 'true');
    const user = userEvent.setup();

    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Processos' })).toBeInTheDocument();

    // Botão de menu hamburguer mobile
    const menuBtn = screen.getByRole('button', { name: 'Abrir menu de navegação' });
    expect(menuBtn).toBeInTheDocument();

    // Abre a gaveta mobile (Sheet)
    await user.click(menuBtn);

    // Gaveta abre e links aparecem
    await waitFor(() => {
      const links = screen.getAllByRole('link', { name: /Processos/i });
      expect(links.length).toBeGreaterThan(0);
    });

    // Foca em um link dentro da gaveta
    const links = screen.getAllByRole('link', { name: /Processos/i });
    const drawerLink = links[links.length - 1]!;
    await user.hover(drawerLink);
    drawerLink.focus();
    expect(drawerLink).toHaveFocus();
  });

  it('renderiza /demo com VITE_MODO_DEMO ligado em desktop (1280px) e celular (376px)', async () => {
    // @ts-expect-error mutando para testar comportamento ligado
    import.meta.env.VITE_MODO_DEMO = 'true';
    window.history.pushState({}, '', '/demo/processos');
    const user = userEvent.setup();

    // Testa em 1280px
    setViewportWidth(1280);
    const { unmount } = render(<App />);

    expect(await screen.findByText('Demonstração com dados fictícios')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Processos em Monitoramento' })).toBeInTheDocument();
    unmount();

    // Testa em 376px (celular)
    setViewportWidth(376);
    render(<App />);

    expect(await screen.findByText('Demonstração com dados fictícios')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Processos em Monitoramento' })).toBeInTheDocument();

    // Abre drawer mobile na demo
    const menuBtn = screen.getByRole('button', { name: 'Abrir menu de navegação da demonstração' });
    await user.click(menuBtn);
    expect(await screen.findByRole('button', { name: 'Fechar menu' })).toBeInTheDocument();
  });

  it('em desenvolvimento com VITE_MODO_DEMO desligado, acessar /demo mostra aviso com instrução em vez de tela preta', async () => {
    // Simula import.meta.env.VITE_MODO_DEMO como false
    const originalDemoVal = import.meta.env.VITE_MODO_DEMO;
    // @ts-expect-error mutando para testar comportamento desligado
    import.meta.env.VITE_MODO_DEMO = 'false';

    window.history.pushState({}, '', '/demo');

    try {
      render(<App />);
      expect(await screen.findByText('Demonstração desligada')).toBeInTheDocument();
      expect(
        screen.getByText(/A demonstração está desligada\. Defina/i)
      ).toBeInTheDocument();
      expect(screen.getByText('VITE_MODO_DEMO=true')).toBeInTheDocument();
      expect(screen.getByText('apps/web/.env')).toBeInTheDocument();
    } finally {
      // @ts-expect-error restaurando
      import.meta.env.VITE_MODO_DEMO = originalDemoVal;
    }
  });

  describe('ErrorBoundary', () => {
    it('captura falha de renderização de filho e exibe mensagem em português com botão de recarregar', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const reloadMock = vi.fn();
      // @ts-expect-error mock window.location.reload
      delete window.location;
      // @ts-expect-error mock window.location.reload
      window.location = { ...originalLocation, reload: reloadMock };

      function ComponenteQuebrado(): React.ReactNode {
        throw new Error('Erro de renderização forçado');
      }

      const user = userEvent.setup();

      render(
        <ErrorBoundary>
          <ComponenteQuebrado />
        </ErrorBoundary>
      );

      // Confirma que a mensagem em português é exibida
      expect(
        screen.getByRole('heading', { name: 'Algo deu errado. Recarregue a página.' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Ocorreu uma falha inesperada na interface/i)
      ).toBeInTheDocument();

      // Confirma que o erro foi registrado no console
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clica no botão "Recarregar"
      const reloadBtn = screen.getByRole('button', { name: /Recarregar/i });
      await user.click(reloadBtn);
      expect(reloadMock).toHaveBeenCalledTimes(1);

      // Restaura window.location
      window.location = originalLocation;
      consoleErrorSpy.mockRestore();
    });
  });
});
