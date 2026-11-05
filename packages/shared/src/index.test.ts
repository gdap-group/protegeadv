import { describe, it, expect } from "vitest";
import { validarNumeroCNJ, cnjSchema } from "./index";

describe("Validação de CNJ", () => {
  it("valida número CNJ matematicamente correto", () => {
    // 0000001-73.2023.8.26.0100 (mod 97 = 1)
    const cnjValido = "0000001-73.2023.8.26.0100";
    expect(validarNumeroCNJ(cnjValido)).toBe(true);
    expect(cnjSchema.safeParse(cnjValido).success).toBe(true);
  });

  it("rejeita número com dígito verificador incorreto", () => {
    const cnjInvalido = "0000001-00.2023.8.26.0100";
    expect(validarNumeroCNJ(cnjInvalido)).toBe(false);
    expect(cnjSchema.safeParse(cnjInvalido).success).toBe(false);
  });

  it("rejeita número com tamanho diferente de 20 dígitos", () => {
    expect(validarNumeroCNJ("12345")).toBe(false);
  });
});
