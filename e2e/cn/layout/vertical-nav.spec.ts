import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/vertical-nav";

test.describe("VerticalNav (CN)", () => {
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

  test("item ativo tem aria-current=page", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Components/ })).toHaveAttribute("aria-current", "page");
  });

  test("clicar num item dispara onSelect (troca o item ativo)", async ({ page }) => {
    await page.getByRole("button", { name: "Home" }).click();
    await expect(page.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("button", { name: /Components/ })).not.toHaveAttribute("aria-current", "page");
  });

  test("item disabled nao dispara onSelect", async ({ page }) => {
    const settings = page.getByRole("button", { name: "Settings" });
    await expect(settings).toBeDisabled();
  });

  test("item com filhos: aria-expanded alterna ao clicar", async ({ page }) => {
    const design = page.getByRole("button", { name: "Design" });
    await expect(design).toHaveAttribute("aria-expanded", "true");
    await design.click();
    await expect(design).toHaveAttribute("aria-expanded", "false");
  });

  test("badge numerico e textual renderizam via <Badge> CN", async ({ page }) => {
    await expect(page.getByText("12", { exact: true })).toBeVisible();
    await expect(page.getByText("34", { exact: true })).toBeVisible();
  });
});
