import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/hover-card";

test.describe("HoverCard", () => {
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

  test("hover no trigger revela o card com role=tooltip", async ({ page }) => {
    await page.getByRole("button", { name: "Hover me" }).hover();
    const card = page.getByRole("tooltip").filter({ hasText: "Kikito CN" });
    await expect(card).toBeVisible();
  });
});
