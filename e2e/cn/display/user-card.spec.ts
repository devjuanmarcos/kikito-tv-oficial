import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/user-card";

test.describe("UserCard", () => {
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

  test("clicar em Follow alterna pra Following", async ({ page }) => {
    const frame = page.locator("main");
    const followBtn = frame.getByRole("button", { name: "Follow" });
    await expect(followBtn).toBeVisible();
    await followBtn.click();
    await expect(frame.getByRole("button", { name: "Following" })).toBeVisible();
  });

  test("badge e stats do card com dados completos aparecem", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("Pro", { exact: true })).toBeVisible();
    await expect(frame.getByText("Followers")).toBeVisible();
    await expect(frame.getByText("3.4K")).toBeVisible();
  });
});
