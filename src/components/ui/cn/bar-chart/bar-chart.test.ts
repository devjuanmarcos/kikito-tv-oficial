import { describe, expect, it } from "vitest";

import type { ChartTheme } from "@/lib/echarts";

import { buildBarOption } from "./BarChart";

const theme: ChartTheme = {
  textColor: "black",
  mutedTextColor: "gray",
  faintTextColor: "silver",
  axisColor: "rule",
  surfaceColor: "white",
  primaryColor: "gold",
  palette: ["gold", "blue"],
  tokenColors: { "--ks-primary": "gold", "--ks-success": "green" },
};

function getSeriesData(option: ReturnType<typeof buildBarOption>) {
  const series = (option.series as Array<{ data?: Array<Record<string, unknown>> }> | undefined)?.[0];
  return series?.data ?? [];
}

describe("buildBarOption", () => {
  it("uses the primary token for bars without an explicit color", () => {
    const option = buildBarOption(
      [
        { label: "A", value: 8, color: "var(--ks-primary)" },
        { label: "B", value: 4 },
      ],
      { orientation: "vertical", barWidth: 36, showValues: true, showBaseline: true, color: undefined, theme }
    );

    expect(getSeriesData(option)).toEqual([
      expect.objectContaining({ value: 8, itemStyle: { color: "gold" } }),
      expect.objectContaining({ value: 4, itemStyle: { color: "gold" } }),
    ]);
    expect(option.series).toEqual([
      expect.objectContaining({ itemStyle: { borderRadius: 4 }, label: expect.objectContaining({ show: true }) }),
    ]);
  });

  it("renders only one horizontal baseline and supports explicit colors", () => {
    const option = buildBarOption(
      [
        { label: "A", value: 3 },
        { label: "B", value: 7, color: "var(--ks-success)" },
      ],
      { orientation: "horizontal", barWidth: 20, showValues: false, showBaseline: true, color: "purple", theme }
    );

    expect(option.xAxis).toEqual(
      expect.objectContaining({
        type: "value",
        max: 7,
        axisLine: expect.objectContaining({ show: true }),
      })
    );
    expect(option.yAxis).toEqual(
      expect.objectContaining({
        type: "category",
        data: ["A", "B"],
        axisLine: expect.objectContaining({ show: false }),
      })
    );
    expect(getSeriesData(option)).toEqual([
      expect.objectContaining({ value: 3, itemStyle: { color: "purple" } }),
      expect.objectContaining({ value: 7, itemStyle: { color: "green" } }),
    ]);
  });

  it("only shows vertical values when the rendered bar is taller than 12 pixels", () => {
    const option = buildBarOption(
      [
        { label: "Short", value: 1 },
        { label: "Tall", value: 10 },
      ],
      { orientation: "vertical", barWidth: 20, showValues: true, showBaseline: true, height: 100, visible: true, theme }
    );

    expect(getSeriesData(option)).toEqual([
      expect.objectContaining({ label: { show: false } }),
      expect.objectContaining({ label: { show: true } }),
    ]);
  });

  it("keeps animated bars collapsed until the chart becomes visible", () => {
    const option = buildBarOption([{ label: "A", value: 10 }], {
      orientation: "vertical",
      barWidth: 20,
      showValues: true,
      showBaseline: true,
      animate: true,
      visible: false,
      theme,
    });

    expect(option.animation).toBe(false);
    expect(getSeriesData(option)).toEqual([expect.objectContaining({ value: 0, label: { show: false } })]);
  });
});
