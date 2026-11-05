// @vitest-environment jsdom
import '../../test/setup';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { PermissoesProvider } from '../../contexts/PermissoesContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainLayout } from './MainLayout';

describe('Casca do Sistema — Menu, Permissões e Acessibilidade (Passo 3.3)', () => {
  // (a) Provider com módulos restritos esconde os itens certos
  it('(a) provider com módulos restritos esconde os itens não permitidos no menu', () => {
    render(
      <PermissoesProvider modulosPermitidos={['processos', 'agenda']}>
        <MemoryRouter initialEntries={['/processos']}>
          <Sidebar />
        </MemoryRouter>
      </PermissoesProvider>
    );

    // Módulos permitidos devem aparecer
    expect(screen.getByRole('link', { name: /Processos/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Agenda/i })).toBeInTheDocument();

    // Módulos não autorizados NÃO devem aparecer
    expect(screen.queryByRole('link', { name: /Publicações/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Contratos/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Protege Empresa/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Configurações/i })).not.toBeInTheDocument();
  });

  // (b) Ctrl+K abre a paleta de comandos e Esc fecha
  it('(b) Ctrl+K abre a paleta de comandos e Esc fecha', async () => {
    const user = userEvent.setup();
    render(
      <PermissoesProvider>
        <MemoryRouter>
          <Header onOpenMobileDrawer={() => {}} />
        </MemoryRouter>
      </PermissoesProvider>
    );

    expect(screen.queryByRole('dialog', { name: 'Paleta de Comandos' })).not.toBeInTheDocument();

    // Pressiona Ctrl+K
    await user.keyboard('{Control>}k{/Control}');
    expect(await screen.findByRole('dialog', { name: 'Paleta de Comandos' })).toBeInTheDocument();

    // Pressiona Escape
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Paleta de Comandos' })).not.toBeInTheDocument();
    });
  });

  // (c) Navegação do menu troca de página
  it('(c) navegação do menu troca de página corretamente', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Inicialmente em /processos
    expect(await screen.findByRole('heading', { name: 'Processos' })).toBeInTheDocument();
    expect(screen.getByText('Nenhum processo ainda')).toBeInTheDocument();

    // Clica no link de Agenda
    const agendaLink = screen.getByRole('link', { name: /Agenda/i });
    await user.click(agendaLink);

    expect(await screen.findByRole('heading', { name: 'Agenda' })).toBeInTheDocument();
    expect(screen.getByText('Nenhum compromisso agendado')).toBeInTheDocument();

    // Clica no link de Publicações
    const publicacoesLink = screen.getByRole('link', { name: /Publicações/i });
    await user.click(publicacoesLink);

    expect(await screen.findByRole('heading', { name: 'Publicações' })).toBeInTheDocument();
    expect(screen.getByText('Nenhuma publicação ainda')).toBeInTheDocument();
  });

  // (d) Em largura de celular o menu aparece como gaveta
  it('(d) botão mobile na barra superior abre a gaveta do menu', async () => {
    const user = userEvent.setup();
    render(
      <PermissoesProvider>
        <MemoryRouter initialEntries={['/processos']}>
          <MainLayout />
        </MemoryRouter>
      </PermissoesProvider>
    );

    // Botão hamburguer para mobile
    const mobileMenuBtn = screen.getByRole('button', { name: 'Abrir menu de navegação' });
    expect(mobileMenuBtn).toBeInTheDocument();

    await user.click(mobileMenuBtn);

    // Deve abrir o Sheet (dialog acessível) contendo os itens do menu
    const drawer = await screen.findByRole('dialog');
    expect(drawer).toBeInTheDocument();

    // Pressiona Escape para fechar
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  // (e) Validação axe sem violações na casca do sistema
  it('(e) MainLayout não possui violações de acessibilidade (axe)', async () => {
    const { container } = render(
      <PermissoesProvider>
        <MemoryRouter initialEntries={['/processos']}>
          <MainLayout />
        </MemoryRouter>
      </PermissoesProvider>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

