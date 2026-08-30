import { describe, expect, it, vi } from "vitest";

import { resolveChartColor, resolveChartTheme, withMotionPreference } from "./chart-theme";

describe("chart theme bridge", () => {
  it("resolve CSS custom properties without changing explicit colors", () => {
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      getPropertyValue: (name: string) => (name === "--ks-primary" ? " hsl(42 70% 50%) " : ""),
    } as CSSStyleDeclaration);

    expect(resolveChartColor("var(--ks-primary)")).toBe("hsl(42 70% 50%)");
    expect(resolveChartColor("#123456")).toBe("#123456");
  });

  it("keeps theme references stable for SSR and hydration", () => {
    vi.spyOn(window, "getComputedStyle").mockReturnValue({
      getPropertyValue: (name: string) =>
        ({
          "--ks-text": "hsl(0 0% 10%)",
          "--ks-text-muted": "hsl(0 0% 40%)",
          "--ks-text-faint": "hsl(0 0% 55%)",
          "--ks-rule": "hsl(0 0% 80%)",
          "--ks-lacquer-raised": "hsl(0 0% 98%)",
        })[name] ?? "",
    } as CSSStyleDeclaration);

    expect(resolveChartTheme()).toMatchObject({
      textColor: "var(--ks-text)",
      mutedTextColor: "var(--ks-text-muted)",
      faintTextColor: "var(--ks-text-faint)",
      axisColor: "var(--ks-rule)",
      surfaceColor: "var(--ks-lacquer-raised)",
    });
  });

  it("disables ECharts animation when reduced motion is requested", () => {
    expect(withMotionPreference({ animation: true, animationDuration: 500 }, true)).toEqual({
      animation: false,
      animationDuration: 0,
    });
    expect(withMotionPreference({ animation: true, animationDuration: 500 }, false)).toEqual({
      animation: true,
      animationDuration: 500,
    });
  });
});
