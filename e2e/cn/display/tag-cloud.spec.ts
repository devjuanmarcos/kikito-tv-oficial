import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/tag-cloud";

test.describe("TagCloud (CN)", () => {
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

  test("tags com peso diferente tem font-size real diferente", async ({ page }) => {
    const reactTag = page.getByText("React", { exact: true }).first();
    const awsTag = page.getByText("AWS", { exact: true }).first();
    const [reactSize, awsSize] = await Promise.all([
      reactTag.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      awsTag.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ]);
    expect(reactSize).toBeGreaterThan(awsSize);
  });

  test("onClick dispara mesmo em tags renderizadas como button (sem href)", async ({ page }) => {
    await expect(page.getByText("Clicked: none")).toBeVisible();
    const button = page.getByRole("button", { name: "React" }).last();
    await button.click();
    await expect(page.getByText("Clicked: React")).toBeVisible();
  });
});
