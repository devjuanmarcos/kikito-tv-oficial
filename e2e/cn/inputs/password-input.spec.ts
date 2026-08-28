import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/password-input";

test.describe("PasswordInput", () => {
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

  test("botão Show password alterna type text/password", async ({ page }) => {
    const frame = page.locator("main");
    const input = frame.getByPlaceholder("Enter password", { exact: true });
    const wrapper = input.locator("..");
    await expect(input).toHaveAttribute("type", "password");
    await wrapper.getByRole("button", { name: "Show password" }).click();
    await expect(input).toHaveAttribute("type", "text");
    await wrapper.getByRole("button", { name: "Hide password" }).click();
    await expect(input).toHaveAttribute("type", "password");
  });

  test("medidor de força expõe role=progressbar com aria-valuetext", async ({ page }) => {
    const frame = page.locator("main");
    const meter = frame.getByRole("progressbar", { name: "Password strength" });
    await expect(meter).toBeVisible();
    await expect(meter).toHaveAttribute("aria-valuetext", "Strong");
  });

  test("campo invalid tem aria-invalid e aria-describedby apontando pra mensagem de erro", async ({ page }) => {
    const frame = page.locator("main");
    const input = frame.getByPlaceholder("Invalid", { exact: true });
    await expect(input).toHaveAttribute("aria-invalid", "true");
    const describedBy = await input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("Password is too short.");
  });
});
