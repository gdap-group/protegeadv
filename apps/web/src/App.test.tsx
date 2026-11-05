// @vitest-environment jsdom
import "./test/setup";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza o título do sistema", () => {
    render(<App />);
    expect(screen.getByText("Protege ADV & Protege Empresa")).toBeInTheDocument();
  });
});
