import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/table-of-contents";

test.describe("TableOfContents", () => {
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

  test("clicar num item troca qual esta ativo", async ({ page }) => {
    const frame = page.locator('text="TOC with active tracking (click to select)"').locator("..");
    await expect(frame.getByText("On this page")).toBeVisible();
    const usage = frame.getByText("Usage", { exact: true });
    await usage.click();
    // achado real: onItemClick controla activeId, entao o item clicado deve
    // ficar marcado como ativo (aria-current ou classe de destaque)
    await expect(usage).toHaveAttribute("aria-current", "true");
  });
});
