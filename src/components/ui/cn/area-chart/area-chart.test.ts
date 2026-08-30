import { describe, expect, it } from "vitest";

import type { ChartTheme } from "@/lib/echarts";

import { buildAreaOption } from "./AreaChart";

const theme: ChartTheme = {
  textColor: "black",
  mutedTextColor: "gray",
  faintTextColor: "silver",
  axisColor: "rule",
  surfaceColor: "white",
  primaryColor: "gold",
  palette: ["gold", "kinpaku", "info", "green", "warning", "danger"],
  tokenColors: {
    "--ks-primary": "gold",
    "--ks-kinpaku": "kinpaku",
    "--ks-info": "info",
    "--ks-success": "green",
    "--ks-warning": "warning",
    "--ks-danger": "danger",
  },
};

function getSeries(option: ReturnType<typeof buildAreaOption>) {
  return option.series as Array<Record<string, unknown>>;
}

describe("buildAreaOption", () => {
  it("builds wide data into labeled area series with resolved colors and tooltip", () => {
    const option = buildAreaOption(
      [
        { label: "Jan", desktop: 10, mobile: 5 },
        { label: "Feb", desktop: 20, mobile: "bad" },
      ],
      [
        { key: "desktop", label: "Desktop", color: "var(--ks-primary)" },
        { key: "mobile", label: "Mobile" },
      ],
      { showGrid: true, showDots: true, showTooltip: true, stacked: false, gradient: true, height: 240, theme }
    );

    expect(option.xAxis).toEqual(
      expect.objectContaining({
        type: "category",
        data: ["Jan", "Feb"],
        axisLabel: expect.objectContaining({ color: "silver", fontSize: 10 }),
      })
    );
    expect(option.yAxis).toEqual(
      expect.objectContaining({
        type: "value",
        min: 0,
        max: 20,
        splitNumber: 4,
        axisLabel: expect.objectContaining({ color: "silver", fontSize: 10 }),
      })
    );
    expect(option.tooltip).toEqual(expect.objectContaining({ show: true, trigger: "axis" }));
    expect(getSeries(option)).toEqual([
      expect.objectContaining({
        name: "Desktop",
        type: "line",
        data: [10, 20],
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "gold", borderColor: "white", borderWidth: 1.5 },
        lineStyle: { color: "gold", width: 2, join: "round", cap: "round" },
        areaStyle: expect.objectContaining({ opacity: 1 }),
      }),
      expect.objectContaining({ name: "Mobile", data: [5, 0], stack: undefined }),
    ]);
  });

  it("preserves stacked series and switches off optional visual features", () => {
    const option = buildAreaOption(
      [{ label: "A", one: 3, two: 4 }],
      [{ key: "one" }, { key: "two", color: "var(--ks-danger)" }],
      { showGrid: false, showDots: false, showTooltip: false, stacked: true, gradient: false, height: 200, theme }
    );

    expect(option.grid).toEqual(expect.objectContaining({ left: 44, right: 16, top: 16, bottom: 32 }));
    expect(option.yAxis).toEqual(
      expect.objectContaining({
        splitLine: expect.objectContaining({ show: false }),
        max: 7,
      })
    );
    expect(option.tooltip).toEqual(expect.objectContaining({ show: false }));
    expect(getSeries(option)).toEqual([
      expect.objectContaining({ stack: "total", symbol: "none", areaStyle: { color: "gold", opacity: 0.15 } }),
      expect.objectContaining({
        stack: "total",
        data: [4],
        itemStyle: { color: "danger", borderColor: "white", borderWidth: 1.5 },
      }),
    ]);
  });

  it("applies step interpolation to every series", () => {
    const option = buildAreaOption([{ label: "A", one: 3 }], [{ key: "one" }], {
      showGrid: true,
      showDots: true,
      showTooltip: true,
      stacked: false,
      gradient: true,
      height: 240,
      step: "start",
      theme,
    });
    expect(getSeries(option)[0]).toEqual(expect.objectContaining({ step: "start" }));
  });
});
