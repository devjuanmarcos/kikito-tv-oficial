import { describe, expect, it } from "vitest";

import type { ChartTheme } from "@/lib/echarts";

import { buildRadialBarOption } from "./RadialBarChart";

const theme: ChartTheme = {
  textColor: "black",
  mutedTextColor: "gray",
  faintTextColor: "silver",
  axisColor: "rule",
  surfaceColor: "white",
  primaryColor: "gold",
  palette: ["gold", "blue"],
  tokenColors: { "--ks-primary": "gold" },
};

describe("buildRadialBarOption", () => {
  it("maps each segment to a concentric polar bar with resolved colors", () => {
    const option = buildRadialBarOption(
      [
        { label: "A", value: 80, color: "var(--ks-primary)" },
        { label: "B", value: 40 },
      ],
      theme
    );

    expect(option.series).toEqual([
      expect.objectContaining({
        type: "bar",
        coordinateSystem: "polar",
        data: [{ value: 80 }],
        itemStyle: { color: "gold" },
      }),
      expect.objectContaining({
        type: "bar",
        coordinateSystem: "polar",
        data: [{ value: 40 }],
        itemStyle: { color: "blue" },
      }),
    ]);
    expect(option.polar).toEqual(expect.objectContaining({ radius: ["22%", "90%"] }));
  });
});
