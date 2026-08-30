import { describe, expect, it } from "vitest";

import { buildFunnelOption } from "./FunnelChart";

describe("buildFunnelOption", () => {
  it("maps ordered stages to a native ECharts funnel", () => {
    const option = buildFunnelOption(
      [
        { label: "Visits", value: 100 },
        { label: "Sales", value: 20 },
      ],
      {
        textColor: "white",
        mutedTextColor: "gray",
        faintTextColor: "silver",
        axisColor: "rule",
        surfaceColor: "black",
        primaryColor: "gold",
        palette: ["gold", "blue"],
        tokenColors: {},
      }
    );
    expect(option.series).toEqual([
      expect.objectContaining({
        type: "funnel",
        sort: "none",
        data: [
          expect.objectContaining({ name: "Visits", value: 100 }),
          expect.objectContaining({ name: "Sales", value: 20 }),
        ],
      }),
    ]);
  });
});
