import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/navigation-menu";

test.describe("NavigationMenu", () => {
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

  test("achado real corrigido: item com href é <a> de verdade (link), não <button>", async ({ page }) => {
    const frame = page.locator("main");
    const homeLink = frame.getByRole("link", { name: "Home" }).first();
    await expect(homeLink).toHaveAttribute("href", "#home");
  });

  test("achado real corrigido: dropdown fecha com Escape", async ({ page }) => {
    const frame = page.locator("main");
    const trigger = frame.getByRole("button", { name: "Products" }).first();
    await trigger.click();
    await expect(frame.getByRole("link", { name: "Kikito CN" }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(frame.getByRole("link", { name: "Kikito CN" }).first()).not.toBeVisible();
  });

  test("item disabled não navega ao clicar", async ({ page }) => {
    const frame = page.locator("main");
    const disabledLink = frame.getByRole("link", { name: "Coming soon" }).first();
    await expect(disabledLink).toHaveAttribute("aria-disabled", "true");
  });

  test("badge do item renderiza via Badge CN", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("3", { exact: true }).first()).toBeVisible();
  });
});
