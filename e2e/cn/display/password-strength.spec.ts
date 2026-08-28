import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/password-strength";

test.describe("PasswordStrength (CN)", () => {
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

  test("progressbar tem aria-valuenow/valuetext que muda ao digitar", async ({ page }) => {
    const input = page.locator('main input[type="password"]');
    const bar = page.getByRole("progressbar", { name: "Password strength" });
    await expect(bar).toHaveAttribute("aria-valuenow", "0");

    await input.fill("Abc123!@");
    await expect(bar).toHaveAttribute("aria-valuenow", "4");
    await expect(bar).toHaveAttribute("aria-valuetext", "Strong");
  });

  test("checklist de regras expoe estado met/not met via aria-label", async ({ page }) => {
    // texto do rotulo fica dentro de um <span aria-hidden>, entao busca-se o <li>
    // diretamente pelo aria-label (getByText casaria tanto o <li> quanto o <span> filho)
    const input = page.locator('main input[type="password"]');
    await input.fill("abc");
    const lenRule = page.locator('li[aria-label^="At least 8 characters"]');
    await expect(lenRule).toHaveAttribute("aria-label", /not met/);

    await input.fill("abcdefgh");
    await expect(lenRule).toHaveAttribute("aria-label", /: met$/);
  });
});
