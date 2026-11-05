import { z } from 'zod';

export interface ZodIssueLike {
  code: string;
  input?: unknown;
  received?: unknown;
  format?: string;
  validation?: string;
  minimum?: number;
  maximum?: number;
  [key: string]: unknown;
}

/**
 * Mapa de mensagens de erro amigáveis em português para o Zod.
 * Compatível com Zod v3 e Zod v4.
 */
export function zodPtCustomError(iss: ZodIssueLike): string | undefined {
  if (iss.code === 'invalid_type') {
    if (iss.input === undefined || iss.received === 'undefined') {
      return 'Campo obrigatório';
    }
    return 'Tipo de dado inválido';
  }

  if (
    (iss.code === 'invalid_format' && iss.format === 'email') ||
    iss.validation === 'email'
  ) {
    return 'E-mail inválido';
  }

  if (iss.code === 'too_small') {
    if (iss.minimum === 1) {
      return 'Campo obrigatório';
    }
    return `Deve ter no mínimo ${iss.minimum} caracteres`;
  }

  if (iss.code === 'too_big') {
    return `Deve ter no máximo ${iss.maximum} caracteres`;
  }

  if (iss.code === 'invalid_date') {
    return 'Data inválida';
  }

  return undefined;
}

/**
 * Registra o mapa de erros em português globalmente no Zod.
 */
export function configurarZodPt(): void {
  z.setErrorMap(zodPtCustomError as (iss: unknown) => string | undefined);
}
