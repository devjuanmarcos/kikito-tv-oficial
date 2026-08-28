import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/scroll-progress";

test.describe("ScrollProgress", () => {
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

  test("role=progressbar com aria-valuenow atualizando ao rolar o container", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("text=Scroll Progress — barra de progresso").locator("..");
    const bar = frame.getByRole("progressbar");
    await expect(bar).toHaveAttribute("aria-valuenow", "0");

    const scrollContainer = frame.locator("div.overflow-y-auto");
    await scrollContainer.evaluate((el) => el.scrollTo({ top: el.scrollHeight }));
    await expect.poll(async () => bar.getAttribute("aria-valuenow")).not.toBe("0");
  });
});
