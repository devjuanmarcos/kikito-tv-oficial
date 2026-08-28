import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/switch";

test.describe("Switch", () => {
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

  test("role=switch com aria-checked correto, clicar alterna", async ({ page }) => {
    const frame = page.locator('text="Controlled switches"').locator("..");
    const darkMode = frame.getByRole("switch", { name: "Dark mode" });
    await expect(darkMode).toHaveAttribute("aria-checked", "false");
    await darkMode.click({ force: true });
    await expect(darkMode).toHaveAttribute("aria-checked", "true");
  });

  test("description fica associada via aria-describedby", async ({ page }) => {
    const frame = page.locator('text="Controlled switches"').locator("..");
    const darkMode = frame.getByRole("switch", { name: "Dark mode" });
    const describedBy = await darkMode.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("Switch to dark theme globally");
  });

  test("todos os 6 intents renderizam", async ({ page }) => {
    const frame = page.locator('text="All intents (on)"').locator("..");
    for (const intent of ["primary", "secondary", "success", "destructive", "warning", "info"]) {
      await expect(frame.getByRole("switch", { name: intent })).toBeChecked();
    }
  });
});
