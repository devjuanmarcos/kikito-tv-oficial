import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/combobox";

test.describe("Combobox", () => {
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

  test("multi-select: escolher opção adiciona chip removível", async ({ page }) => {
    const frame = page.locator('text="Multi-select"').locator("..");
    await frame.getByRole("combobox").click();
    await frame.getByRole("option", { name: "Design" }).click();
    const chip = frame.locator("span", { hasText: "Design" }).first();
    await expect(chip).toBeVisible();

    // escolhe uma segunda opção — acumula, não substitui
    await frame.getByRole("option", { name: "Development" }).click();
    await expect(frame.locator("span", { hasText: "Development" }).first()).toBeVisible();
    await expect(chip).toBeVisible();

    // remove o primeiro chip pelo botão de fechar
    await chip.getByRole("button").click();
    await expect(page.locator('text="Multi-select"').locator("..").locator("span", { hasText: "Design" })).toHaveCount(
      0
    );
  });

  test("maxSelected=1: segunda opção não é aceita", async ({ page }) => {
    const frame = page.locator('text="Single (maxSelected=1)"').locator("..");
    await frame.getByRole("combobox").click();
    await frame.getByRole("option", { name: "Design" }).click();
    await frame.getByRole("combobox").click();
    await frame.getByRole("option", { name: "Development" }).click();
    await expect(frame.getByRole("option", { name: "Design" })).toHaveAttribute("aria-selected", "true");
    await expect(frame.getByRole("option", { name: "Development" })).toHaveAttribute("aria-selected", "false");
  });
});
