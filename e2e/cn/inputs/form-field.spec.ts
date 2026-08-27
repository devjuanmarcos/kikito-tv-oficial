import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/form-field";

test.describe("FormField (CN)", () => {
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

  test("label associado ao input real via htmlFor/id (getByLabel funciona)", async ({ page }) => {
    await expect(page.getByLabel("Email address")).toBeVisible();
  });

  test("hint tem id estavel e o input aponta pra ele via aria-describedby", async ({ page }) => {
    const input = page.getByLabel("Email address");
    const describedBy = await input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("We'll never share your email.");
  });

  test("erro tem role=alert e id apontado pelo aria-describedby do input", async ({ page }) => {
    const input = page.getByLabel("Password");
    const describedBy = await input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const error = page.locator(`#${describedBy}`);
    await expect(error).toHaveAttribute("role", "alert");
    await expect(error).toContainText("Password must be at least 8 characters.");
  });
});
