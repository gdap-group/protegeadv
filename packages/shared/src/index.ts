import { z } from "zod";

/**
 * Validador e normalizador de número de processo CNJ
 * Formato: NNNNNNN-DD.AAAA.J.TR.OOOO (20 dígitos)
 * Regra Resolução 65 CNJ: (NNNNNNN + AAAA + J + TR + OOOO + DD) % 97 === 1
 */
export function validarNumeroCNJ(numero: string): boolean {
  const digits = numero.replace(/\D/g, "");
  if (digits.length !== 20) return false;

  const n = digits.slice(0, 7);
  const d = digits.slice(7, 9);
  const restoCnj = digits.slice(9, 20); // AAAA.J.TR.OOOO

  try {
    const check = BigInt(`${n}${restoCnj}${d}`) % 97n;
    return check === 1n;
  } catch {
    return false;
  }
}

export const cnjSchema = z
  .string()
  .min(20)
  .max(25)
  .refine((val) => validarNumeroCNJ(val), {
    message: "Número de processo CNJ inválido ou dígito verificador incorreto.",
  });

/**
 * Tipos de Conta (PRD Seção 3 e 18)
 */
export const TipoContaSchema = z.enum(["escritorio", "empresa", "administrador"]);
export type TipoConta = z.infer<typeof TipoContaSchema>;

/**
 * Estados de Monitoramento do Processo (PRD Seção 4.3)
 */
export const EstadoMonitoramentoSchema = z.enum([
  "em_dia",
  "aguardando_atualizacao",
  "nao_monitorada",
]);
export type EstadoMonitoramento = z.infer<typeof EstadoMonitoramentoSchema>;

/**
 * Status do Processo (PRD Seção 4.2)
 */
export const StatusProcessoSchema = z.enum([
  "indefinido",
  "ativo",
  "suspenso",
  "baixado",
  "encerrado",
  "arquivado",
]);
export type StatusProcesso = z.infer<typeof StatusProcessoSchema>;

/**
 * Schema base para entidades multi-tenant (PRD Seção 18)
 * Regra 4: Toda tabela com dados de escritório tem coluna conta_id
 */
export const EntidadeMultiTenantSchema = z.object({
  id: z.string().uuid(),
  conta_id: z.string().uuid(),
  criado_em: z.string().datetime().optional(),
  atualizado_em: z.string().datetime().optional(),
});
export type EntidadeMultiTenant = z.infer<typeof EntidadeMultiTenantSchema>;

export * from "./database.types.js";
