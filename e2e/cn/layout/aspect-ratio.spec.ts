import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/aspect-ratio";

test.describe("AspectRatio (CN)", () => {
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

  test("proporcoes 16:9, 1:1 e 4:3 mantem a razao largura/altura real", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === "mobile-chrome",
      "sidebar do showcase espreme a largura real do Frame (pendência 0b) — quebra qualquer demo que dependa de largura real"
    );
    const boxes = await Promise.all(
      ["16 : 9", "1 : 1", "4 : 3"].map((label) => page.getByText(label, { exact: true }).boundingBox())
    );
    const [wide, square, classic] = boxes;
    expect(wide && square && classic).toBeTruthy();
    if (wide && square && classic) {
      expect(wide.width / wide.height).toBeCloseTo(16 / 9, 1);
      expect(square.width / square.height).toBeCloseTo(1, 1);
      expect(classic.width / classic.height).toBeCloseTo(4 / 3, 1);
    }
  });
});
