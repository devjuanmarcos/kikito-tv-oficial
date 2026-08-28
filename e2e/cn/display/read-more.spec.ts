import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/read-more";

test.describe("ReadMore", () => {
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

  test("clicar em Read more expande o texto e alterna aria-expanded", async ({ page }) => {
    const frame = page.locator('text="Default (maxLength=150)"').locator("..");
    const toggle = frame.getByRole("button", { name: "Read more" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    const collapseBtn = frame.getByRole("button", { name: "Show less" });
    await expect(collapseBtn).toHaveAttribute("aria-expanded", "true");
  });

  test("labels customizados são usados", async ({ page }) => {
    const frame = page.locator('text="Custom labels and shorter maxLength"').locator("..");
    await expect(frame.getByRole("button", { name: "Expand" })).toBeVisible();
    await frame.getByRole("button", { name: "Expand" }).click();
    await expect(frame.getByRole("button", { name: "Collapse" })).toBeVisible();
  });
});
