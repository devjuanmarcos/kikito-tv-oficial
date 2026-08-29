import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/bento-grid";

test.describe("BentoGrid", () => {
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

  test("cols=4 com colSpan=4 gera item de largura total (grid-column: span 4)", async ({ page }) => {
    const frame = page.locator("main");
    const fullWidthCard = frame.getByText("cols=4, colSpan=4 — full-width row").locator("../..");
    const gridColumn = await fullWidthCard.evaluate((el) => getComputedStyle(el).gridColumn);
    expect(gridColumn).toContain("span 4");
  });

  test("item featured (colSpan=2 rowSpan=2) e os demais cards aparecem", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("main");
    await expect(frame.getByText("Featured Item")).toBeVisible();
    await expect(frame.getByText("Analytics")).toBeVisible();
    await expect(frame.getByText("Wide card — spans full row")).toBeVisible();
  });
});
