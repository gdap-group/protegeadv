import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("mescla classes do tailwind corretamente", () => {
    const result = cn("p-4", "text-white", { "bg-black": true, "bg-white": false });
    expect(result).toBe("p-4 text-white bg-black");
  });

  it("resolve conflitos de classes do tailwind", () => {
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });
});
