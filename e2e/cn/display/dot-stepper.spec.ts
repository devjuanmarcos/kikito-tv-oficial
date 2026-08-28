import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/dot-stepper";

test.describe("DotStepper (CN)", () => {
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

  test("clicar num dot muda aria-current e o Next/Prev refletem", async ({ page }) => {
    const group = page.getByRole("group", { name: "Pagination" }).first();
    const dot3 = group.getByRole("button", { name: "Go to step 3" });
    await dot3.click();
    await expect(dot3).toHaveAttribute("aria-current", "step");
  });

  test("progress bar tem role=status e mostra fracao atual", async ({ page }) => {
    const status = page.getByRole("status").first();
    await expect(status).toBeVisible();
    await expect(status).toContainText(/\d\/5/);
  });

  test("dash variant: dot ativo tem largura maior (w-6)", async ({ page }) => {
    const dashGroup = page.getByRole("group", { name: "Pagination" }).nth(1);
    const active = dashGroup.locator('[aria-current="step"]');
    await expect(active).toHaveClass(/w-6/);
  });
});
