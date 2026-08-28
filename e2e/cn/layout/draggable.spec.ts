import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/draggable";

test.describe("Draggable", () => {
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

  test("reordena por teclado (ArrowDown move item pra baixo)", async ({ page }) => {
    const frame = page.locator('text="Drag to reorder (or focus + arrow keys)"').locator("..");
    const items = frame.getByRole("listitem");
    await expect(items.first()).toHaveText("First item");
    await items.first().focus();
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toHaveText("First item");
    await expect(items.first()).toHaveText("Second item");
  });

  test("modo handle: grip tem aria-label e é focável", async ({ page }) => {
    const frame = page.locator('text="With handle"').locator("..");
    const grip = frame.getByRole("button", { name: /Reordenar item 1/ });
    await expect(grip).toBeVisible();
    await grip.focus();
    await page.keyboard.press("ArrowDown");
    const items = frame.getByRole("listitem");
    await expect(items.first()).toHaveText("Second item");
  });

  test("modo horizontal renderiza os itens em linha", async ({ page }) => {
    const frame = page.locator('text="Horizontal"').locator("..");
    await expect(frame.getByText("A", { exact: true })).toBeVisible();
    await expect(frame.getByText("C", { exact: true })).toBeVisible();
  });
});
