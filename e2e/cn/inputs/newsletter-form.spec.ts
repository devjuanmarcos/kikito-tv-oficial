import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/newsletter-form";

test.describe("NewsletterForm (CN)", () => {
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

  test("email invalido mostra erro com role=alert ligado via aria-describedby", async ({ page }) => {
    const input = page.getByLabel("Enter your email address").first();
    await input.fill("nao-e-email");
    await input.locator("xpath=ancestor::form").getByRole("button", { name: "Subscribe" }).click();

    await expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = await input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const error = page.locator(`#${describedBy}`);
    await expect(error).toHaveAttribute("role", "alert");
    await expect(error).toContainText("valid email");
  });

  test("email valido dispara onSubmit e mostra confirmacao com role=status", async ({ page }) => {
    const input = page.getByLabel("Enter your email address").first();
    await input.fill("user@example.com");
    await input.locator("xpath=ancestor::form").getByRole("button", { name: "Subscribe" }).click();

    await expect(page.getByRole("status").filter({ hasText: "subscribed" })).toBeVisible();
  });
});
