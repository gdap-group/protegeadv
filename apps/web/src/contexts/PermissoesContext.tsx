import * as React from 'react';

/**
 * Módulos oficiais do sistema, alinhados rigorosamente ao enum `modulo_sistema` do banco de dados PostgreSQL:
 * 'processos', 'publicacoes', 'agenda', 'pessoas', 'ged', 'contratos', 'usuarios', 'configuracoes', 'empresa'
 */
export type ModuloSistema =
  | 'processos'
  | 'publicacoes'
  | 'agenda'
  | 'pessoas'
  | 'ged'
  | 'contratos'
  | 'usuarios'
  | 'configuracoes'
  | 'empresa';

export const TODOS_OS_MODULOS: ModuloSistema[] = [
  'processos',
  'publicacoes',
  'agenda',
  'pessoas',
  'ged',
  'contratos',
  'empresa',
  'configuracoes',
];

interface PermissoesContextValue {
  modulosPermitidos: ModuloSistema[];
  temPermissao: (modulo: ModuloSistema) => boolean;
}

const PermissoesContext = React.createContext<PermissoesContextValue | null>(null);

export interface PermissoesProviderProps {
  children: React.ReactNode;
  /**
   * Lista customizada de módulos permitidos (útil para injeção de dependência e testes automatizados).
   */
  modulosPermitidos?: ModuloSistema[];
}

export function PermissoesProvider({
  children,
  modulosPermitidos = TODOS_OS_MODULOS,
}: PermissoesProviderProps) {
  // TODO: No Passo 2.4 (Autenticação e Sessão), esta lista será carregada dinamicamente
  // a partir do perfil do usuário logado (tabela usuarios, usuario_grupos e grupo_permissoes)
  // via Supabase Auth e RPC pode(modulo, 'ver').
  // Lembre-se: esconder itens de menu na UI é apenas conveniência; a segurança mandatória é imposta pelo RLS no banco.

  const temPermissao = React.useCallback(
    (modulo: ModuloSistema) => modulosPermitidos.includes(modulo),
    [modulosPermitidos]
  );

  return (
    <PermissoesContext.Provider value={{ modulosPermitidos, temPermissao }}>
      {children}
    </PermissoesContext.Provider>
  );
}

export function useModulosPermitidos() {
  const context = React.useContext(PermissoesContext);
  if (!context) {
    throw new Error('useModulosPermitidos deve ser utilizado dentro de um PermissoesProvider');
  }
  return context;
}

