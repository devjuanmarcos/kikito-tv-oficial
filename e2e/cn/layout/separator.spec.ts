import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/separator";

test.describe("Separator", () => {
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

  test("decorative por padrão: role=none, sem exposição na árvore de acessibilidade", async ({ page }) => {
    const frame = page.locator('text="solid · dashed · dotted"').locator("..");
    const hr = frame.locator("hr").first();
    await expect(hr).toHaveAttribute("role", "none");
  });

  test("separador com label mostra o texto entre as linhas", async ({ page }) => {
    const frame = page.locator('text="With label"').locator("..");
    await expect(frame.getByText("OR")).toBeVisible();
    await expect(frame.getByText("Start")).toBeVisible();
  });

  test("orientação vertical usa aria-orientation", async ({ page }) => {
    const frame = page.locator('text="Inline vertical separator"').locator("..");
    await expect(frame.locator('[aria-orientation="vertical"]')).toBeVisible();
  });
});
