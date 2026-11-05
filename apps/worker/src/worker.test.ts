import { describe, it, expect } from "vitest";
import { iniciarConfiguracaoWorker, executarCicloWorker } from "./index";

describe("Worker de Coleta", () => {
  it("inicializa com intervalos padrão previstos no PRD", () => {
    const config = iniciarConfiguracaoWorker();
    expect(config.intervaloMinutosDJEN).toBe(60); // 1h DJEN
    expect(config.intervaloHorasDataJud).toBe(24); // 24h DataJud
  });

  it("executa ciclo sem erros", async () => {
    const res = await executarCicloWorker();
    expect(res.status).toBe("ok");
    expect(res.timestamp).toBeDefined();
  });
});
