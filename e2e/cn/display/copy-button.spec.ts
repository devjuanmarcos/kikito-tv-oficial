import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/copy-button";

test.describe("CopyButton", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
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

  test("clicar copia o texto e mostra feedback de sucesso", async ({ page }) => {
    const btn = page.getByRole("button", { name: /Copy code|Copied!/ });
    await btn.click();
    await expect(btn).toHaveText("Copied!");
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe("Solid button");
  });

  test("botão continua com role=button e ganha aria-live=polite", async ({ page }) => {
    const btn = page.getByRole("button", { name: "npm install" });
    await expect(btn).toHaveAttribute("aria-live", "polite");
  });
});
