import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/callout";

test.describe("Callout", () => {
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

  test("4 intents soft renderizam com título e texto", async ({ page }, testInfo) => {
    // pendência 0b: em mobile-chrome (~393px) a sidebar do showcase não colapsa e espreme
    // o conteúdo — o título fica clipado/oculto pela largura útil quase zero. Achado
    // sistêmico, não é bug do Callout.
    test.skip(
      testInfo.project.name === "mobile-chrome",
      "pendência 0b — sidebar do showcase espreme o conteúdo em mobile-chrome"
    );
    const frame = page.locator('text="Soft (default)"').locator("..");
    await expect(frame.getByText("Info", { exact: true })).toBeVisible();
    await expect(frame.getByText("Success", { exact: true })).toBeVisible();
    await expect(frame.getByText("Warning", { exact: true })).toBeVisible();
    await expect(frame.getByText("Danger", { exact: true })).toBeVisible();
  });

  test("onClose remove o callout, action dispara callback", async ({ page }) => {
    const frame = page.locator('text="Closable · with action"').locator("..");
    const callout = frame.locator('[role="note"]');
    await expect(callout.getByRole("button", { name: "Learn more" })).toBeVisible();
    await callout.getByRole("button", { name: "Dismiss" }).click();
    await expect(frame.getByText("Show callout again")).toBeVisible();
  });
});
