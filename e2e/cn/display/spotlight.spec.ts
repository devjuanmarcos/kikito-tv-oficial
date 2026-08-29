import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/spotlight";

test.describe("Spotlight", () => {
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

  test("wrapper correto do Card effect=spotlight: mover o mouse revela o glow (opacity 1)", async ({
    page,
    isMobile,
  }) => {
    test.skip(
      isMobile,
      "efeito é mouse-tracked por natureza — mobile-chrome emula touch, sem conceito de hover/cursor"
    );
    const frame = page.locator("main");
    await expect(frame.getByText("Spotlight Effect", { exact: true })).toBeVisible();
    const container = frame.getByText("Move your cursor over this area").locator("../../..");
    const box = await container.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    const glow = container.locator("> div").first();
    await expect(glow).toHaveCSS("opacity", "1");
  });
});
