import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/status-page";

test.describe("StatusPage", () => {
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

  test("grupos e serviços renderizam com status correto", async ({ page, isMobile }) => {
    // pendência 0b já documentada: sidebar/grid do showcase espreme o Frame em mobile-chrome
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("text=Status Page — service health grid").locator("..");
    await expect(frame.getByText("Core Services")).toBeVisible();
    await expect(frame.getByText("Database")).toBeVisible();
    await expect(frame.getByText("Elevated latency")).toBeVisible();
  });

  test("overallStatus omitido calcula automaticamente o pior status (degraded)", async ({ page }) => {
    const frame = page.locator("text=overallStatus omitido").locator("..");
    await expect(frame.getByText("Some systems degraded")).toBeVisible();
  });
});
