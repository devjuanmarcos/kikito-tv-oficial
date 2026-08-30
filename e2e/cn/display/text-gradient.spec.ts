import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/text-gradient";

test.describe("TextGradient", () => {
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

  test("texto visivel com gradiente aplicado via background-clip", async ({ page }) => {
    const frame = page.locator('text="Text Gradient — gradient text with optional animation"').locator("..");
    const heading = frame.getByText("Kikito Design");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveCSS("background-clip", "text");
  });
});
