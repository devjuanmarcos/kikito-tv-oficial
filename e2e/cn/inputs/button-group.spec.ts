import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/button-group";

test.describe("ButtonGroup", () => {
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

  test("role=group com aria-label nos exemplos horizontal e vertical", async ({ page }) => {
    const frame = page.locator('text="Attached (default)"').locator("..");
    await expect(frame.getByRole("group", { name: "Text alignment" })).toBeVisible();
    await expect(frame.getByRole("group", { name: "View options" })).toBeVisible();
  });

  test("detached: botões continuam clicáveis", async ({ page }) => {
    const frame = page.locator('text="Detached"').locator("..");
    await expect(frame.getByRole("button", { name: "Delete" })).toBeVisible();
  });
});
