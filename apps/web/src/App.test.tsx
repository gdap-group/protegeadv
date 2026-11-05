// @vitest-environment jsdom
import "./test/setup";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza a casca do sistema e redireciona para a página de Processos", async () => {
    render(<App />);
    expect(screen.getByText("Protege ADV")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Processos" })).toBeInTheDocument();
    expect(screen.getByText("Nenhum processo ainda")).toBeInTheDocument();
  });
});
