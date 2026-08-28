import { test, expect } from "@playwright/test";

const URL = "/pt/cn/charts/radar-chart";

test.describe("RadarChart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("sem erros de console", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("SVG acessível com aria-label das séries e 2 polígonos de dados", async ({ page }) => {
    const frame = page.locator("text=Radar Chart — multi-series spider chart").locator("..");
    const svg = frame.locator("svg[role='img']");
    await expect(svg).toHaveAttribute("aria-label", /Hero A, Hero B/);
    // 2 séries * 2 polygons cada (fill + stroke) = 4, mais os polígonos de grid (levels=4)
    const seriesPolygons = svg.locator("g polygon");
    await expect(seriesPolygons).toHaveCount(4);
  });

  test("legenda mostra os labels das séries", async ({ page }) => {
    const frame = page.locator("text=Radar Chart — multi-series spider chart").locator("..");
    await expect(frame.getByText("Hero A")).toBeVisible();
    await expect(frame.getByText("Hero B")).toBeVisible();
  });
});
