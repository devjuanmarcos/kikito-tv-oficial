import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/timeline-progress";

test.describe("TimelineProgress (CN)", () => {
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

  test("passos completed/current/upcoming/error todos renderizam", async ({ page }) => {
    // "Account created" aparece nas duas secoes (Default e Error state reusam o 1o passo)
    await expect(page.getByText("Account created").first()).toBeVisible();
    await expect(page.getByText("Profile setup").first()).toBeVisible();
    await expect(page.getByText("First project").first()).toBeVisible();
    await expect(page.getByText("Payment failed")).toBeVisible();
  });
});
