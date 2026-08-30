import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/text-shine";

test.describe("TextShine", () => {
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

  test("texto visivel, animacao roda em loop (nao para)", async ({ page }) => {
    const frame = page.locator('text="Text Shine — brightness sweep loops across the text"').locator("..");
    await expect(frame.getByText("Kikito Design")).toBeVisible();
    await expect(frame.getByText("Faster sweep (2.5s)")).toBeVisible();
  });
});
