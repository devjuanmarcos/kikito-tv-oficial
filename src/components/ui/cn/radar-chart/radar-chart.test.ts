import { describe, expect, it } from "vitest";

import type { ChartTheme } from "@/lib/echarts";

import { buildRadarOption } from "./RadarChart";

const theme: ChartTheme = {
  textColor: "black",
  mutedTextColor: "gray",
  faintTextColor: "silver",
  axisColor: "rule",
  surfaceColor: "white",
  primaryColor: "gold",
  palette: ["gold", "kinpaku", "green", "warning", "danger"],
  tokenColors: {
    "--ks-primary": "gold",
    "--ks-kinpaku": "kinpaku",
    "--ks-success": "green",
    "--ks-danger": "danger",
    "--ks-lacquer": "lacquer",
  },
};

function getSeries(option: ReturnType<typeof buildRadarOption>) {
  return (option.series as Array<{ data?: Array<Record<string, unknown>> }> | undefined)?.[0];
}

describe("buildRadarOption", () => {
  it("builds radar indicators from axis maxima and resolves series colors", () => {
    const option = buildRadarOption(
      [{ label: "Speed", max: 100 }, { label: "Power" }],
      [
        { label: "A", data: [80, 60], color: "var(--ks-primary)" },
        { label: "B", data: [40, 90] },
      ],
      4,
      theme
    );

    expect(option.radar).toEqual(
      expect.objectContaining({
        indicator: [
          { name: "Speed", max: 100 },
          { name: "Power", max: 90 },
        ],
        splitNumber: 4,
      })
    );
    expect(getSeries(option)).toEqual(
      expect.objectContaining({
        data: [
          expect.objectContaining({ name: "A", value: [80, 60], lineStyle: { color: "gold" } }),
          expect.objectContaining({ name: "B", value: [40, 90], lineStyle: { color: "kinpaku" } }),
        ],
        symbol: "circle",
        symbolSize: 6,
        lineStyle: { width: 2, join: "round" },
      })
    );
  });

  it("preserves the primary, kinpaku, success, danger palette order and marker styling", () => {
    const option = buildRadarOption(
      [{ label: "A", max: 100 }],
      [
        { label: "Primary", data: [10] },
        { label: "Kinpaku", data: [20] },
        { label: "Success", data: [30] },
        { label: "Danger", data: [40] },
      ],
      4,
      theme
    );
    const data = getSeries(option)?.data ?? [];

    expect(data).toEqual([
      expect.objectContaining({ itemStyle: { color: "gold", borderColor: theme.surfaceColor, borderWidth: 1.5 } }),
      expect.objectContaining({ itemStyle: { color: "kinpaku", borderColor: theme.surfaceColor, borderWidth: 1.5 } }),
      expect.objectContaining({ itemStyle: { color: "green", borderColor: theme.surfaceColor, borderWidth: 1.5 } }),
      expect.objectContaining({ itemStyle: { color: "danger", borderColor: theme.surfaceColor, borderWidth: 1.5 } }),
    ]);
  });

  it("uses zero for missing axis values and preserves configured series colors", () => {
    const option = buildRadarOption(
      [{ label: "A" }, { label: "B", max: 10 }],
      [{ label: "Team", data: [3], color: "#123456" }],
      3,
      theme
    );

    expect(option.radar).toEqual(
      expect.objectContaining({
        indicator: [
          { name: "A", max: 3 },
          { name: "B", max: 10 },
        ],
      })
    );
    expect(getSeries(option)?.data).toEqual([
      expect.objectContaining({
        value: [3, 0],
        itemStyle: { color: "#123456", borderColor: theme.surfaceColor, borderWidth: 1.5 },
      }),
    ]);
  });
});
