import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/rating-input";

test.describe("RatingInput", () => {
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

  test("controlado: clicar numa estrela atualiza o valor exibido", async ({ page }) => {
    const frame = page.locator('text="Default stars (controlled)"').locator("..");
    await frame.getByRole("button", { name: "Rate 4 of 5" }).click();
    await expect(frame.getByText("Value: 4")).toBeVisible();
  });

  test("read-only: não expõe botões, mostra valor via role=img", async ({ page }) => {
    const frame = page.locator('text="Read-only"').locator("..");
    await expect(frame.getByRole("img", { name: "3.5 out of 5" })).toBeVisible();
    await expect(frame.getByRole("button")).toHaveCount(0);
  });

  test("ícones customizados: heart emoji aparece", async ({ page }) => {
    const frame = page.locator('text="Heart emoji"').locator("..");
    await expect(frame.getByRole("img", { name: "3 out of 5" })).toBeVisible();
  });

  test("disabled: botões ficam desabilitados", async ({ page }) => {
    const frame = page.locator('text="Disabled"').locator("..");
    const firstStar = frame.getByRole("button").first();
    await expect(firstStar).toBeDisabled();
  });
});
