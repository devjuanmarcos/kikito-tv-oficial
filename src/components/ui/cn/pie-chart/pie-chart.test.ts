import { describe, expect, it } from "vitest";

import { buildPieOption } from "./PieChart";

describe("buildPieOption", () => {
  it("creates pie data with resolved token colors", () => {
    const option = buildPieOption(
      [
        { label: "A", value: 3, color: "var(--ks-primary)" },
        { label: "B", value: 1 },
      ],
      {
        primaryColor: "gold",
        palette: ["gold", "blue"],
        tokenColors: { "--ks-primary": "gold" },
        textColor: "black",
        mutedTextColor: "gray",
        faintTextColor: "silver",
        axisColor: "gray",
        surfaceColor: "white",
      }
    );
    expect(option.series).toEqual([
      expect.objectContaining({
        type: "pie",
        data: [
          expect.objectContaining({ name: "A", value: 3, itemStyle: { color: "gold" } }),
          expect.objectContaining({ name: "B", value: 1, itemStyle: { color: "blue" } }),
        ],
      }),
    ]);
  });
});
