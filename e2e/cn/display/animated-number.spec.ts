import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/animated-number";

test.describe("AnimatedNumber", () => {
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

  test("toggle value dispara nova animacao e o numero exibido muda", async ({ page }) => {
    const frame = page.locator('text="Click to animate"').locator("..");
    const first = frame.locator(".tabular-nums").first();
    await expect(first).toBeVisible();
    const before = await first.innerText();
    await frame.getByRole("button", { name: "Toggle value" }).click();
    await page.waitForTimeout(1200);
    await expect(first).not.toHaveText(before);
  });
});
