import { describe, expect, it } from "vitest";

import { buildRadialBarOption } from "./RadialBarChart";

describe("buildRadialBarOption", () => {
  it("maps each segment to a concentric polar bar with resolved colors", () => {
    const option = buildRadialBarOption(
      [
        { label: "A", value: 80, color: "var(--ks-primary)" },
        { label: "B", value: 40 },
      ],
      { primaryColor: "gold", palette: ["gold", "blue"], tokenColors: { "--ks-primary": "gold" } }
    );

    expect(option.series).toEqual([
      expect.objectContaining({ type: "bar", data: [{ value: 80 }], itemStyle: { color: "gold" } }),
      expect.objectContaining({ type: "bar", data: [{ value: 40 }], itemStyle: { color: "blue" } }),
    ]);
    expect(option.coordinateSystem).toBeUndefined();
    expect(option.polar).toEqual(expect.objectContaining({ radius: ["22%", "90%"] }));
  });
});
