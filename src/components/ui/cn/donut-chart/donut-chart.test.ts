import { describe, expect, it } from "vitest";

import { buildDonutOption } from "./DonutChart";

describe("buildDonutOption", () => {
  it("keeps the center content and maps the stroke width to a ring", () => {
    const option = buildDonutOption([{ label: "A", value: 3 }], 28, "responses", 3, {
      primaryColor: "gold",
      palette: ["gold"],
      tokenColors: {},
      textColor: "black",
      mutedTextColor: "gray",
      faintTextColor: "silver",
      axisColor: "gray",
      surfaceColor: "white",
    });
    expect(option.title).toEqual(expect.objectContaining({ text: "3", subtext: "responses" }));
    expect(option.series).toEqual([expect.objectContaining({ type: "pie", radius: ["41.25%", "100%"] })]);
  });
});
