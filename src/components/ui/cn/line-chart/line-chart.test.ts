import { describe, expect, it } from "vitest";

import type { ChartTheme } from "@/lib/echarts";

import { buildLineOption } from "./LineChart";

const theme: ChartTheme = {
  textColor: "black",
  mutedTextColor: "gray",
  faintTextColor: "silver",
  axisColor: "rule",
  surfaceColor: "white",
  primaryColor: "gold",
  palette: ["gold", "kinpaku", "green", "danger"],
  tokenColors: {
    "--ks-primary": "gold",
    "--ks-kinpaku": "kinpaku",
    "--ks-success": "green",
    "--ks-danger": "danger",
  },
};

function getSeries(option: ReturnType<typeof buildLineOption>) {
  return option.series as Array<Record<string, unknown>>;
}

describe("buildLineOption", () => {
  it("builds labeled line series with resolved colors, area, dots, and grid", () => {
    const option = buildLineOption(
      [
        { label: "Revenue", data: [-2, 4, 8], color: "var(--ks-primary)" },
        { label: "Cost", data: [1, 3, 5] },
      ],
      ["Jan", "Feb", "Mar"],
      { showArea: true, showDots: true, showGrid: true, theme }
    );

    expect(option.xAxis).toEqual(
      expect.objectContaining({
        type: "category",
        data: ["Jan", "Feb", "Mar"],
        axisLabel: expect.objectContaining({ show: true, color: "silver", fontSize: 10 }),
      })
    );
    expect(option.yAxis).toEqual(
      expect.objectContaining({
        type: "value",
        min: -2,
        max: 8,
        splitNumber: 4,
        splitLine: expect.objectContaining({ show: true }),
      })
    );
    expect(getSeries(option)).toEqual([
      expect.objectContaining({
        name: "Revenue",
        type: "line",
        data: [-2, 4, 8],
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { color: "gold", width: 2, join: "round" },
        itemStyle: { color: "gold" },
        areaStyle: { color: "gold", opacity: 0.12 },
      }),
      expect.objectContaining({
        name: "Cost",
        data: [1, 3, 5],
        lineStyle: { color: "kinpaku", width: 2, join: "round" },
        itemStyle: { color: "kinpaku" },
      }),
    ]);
  });

  it("keeps the chart unfilled and hides dots and grid when disabled", () => {
    const option = buildLineOption([{ label: "Series", data: [2, 4], color: "#123456" }], undefined, {
      showArea: false,
      showDots: false,
      showGrid: false,
      theme,
    });

    expect(option.xAxis).toEqual(
      expect.objectContaining({
        data: ["0", "1"],
        axisLabel: expect.objectContaining({ show: false }),
      })
    );
    expect(option.yAxis).toEqual(
      expect.objectContaining({
        splitLine: expect.objectContaining({ show: false }),
      })
    );
    expect(getSeries(option)[0]).toEqual(
      expect.objectContaining({
        symbol: "none",
        areaStyle: undefined,
        itemStyle: { color: "#123456" },
      })
    );
  });

  it("attaches a markLine reference line to the first series and applies step interpolation", () => {
    const option = buildLineOption(
      [
        { label: "A", data: [1, 2], color: "#123456" },
        { label: "B", data: [3, 4], color: "#654321" },
      ],
      undefined,
      {
        showArea: false,
        showDots: false,
        showGrid: false,
        referenceLine: { value: 5, label: "Meta: 5" },
        step: "middle",
        theme,
      }
    );

    const series = getSeries(option);
    expect(series[0]).toEqual(
      expect.objectContaining({
        step: "middle",
        markLine: expect.objectContaining({
          silent: true,
          symbol: "none",
          data: [{ yAxis: 5 }],
          label: expect.objectContaining({ show: true, formatter: "Meta: 5" }),
        }),
      })
    );
    // markLine so vai na primeira serie, pra nao duplicar a linha no grafico
    expect(series[1].markLine).toBeUndefined();
    expect(series[1].step).toBe("middle");
  });

  it("omits the reference line when none is provided", () => {
    const option = buildLineOption([{ label: "A", data: [1, 2] }], undefined, {
      showArea: false,
      showDots: false,
      showGrid: false,
      theme,
    });
    expect(getSeries(option)[0].markLine).toBeUndefined();
  });
});
