import "@testing-library/jest-dom/vitest";
import * as matchers from "vitest-axe/matchers";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

if (typeof window !== "undefined") {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;
  // @ts-expect-error global polyfill
  global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;

  if (window.HTMLElement) {
    window.HTMLElement.prototype.scrollIntoView =
      window.HTMLElement.prototype.scrollIntoView || function () {};
  }
}

afterEach(() => {
  cleanup();
});
