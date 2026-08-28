import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/json-viewer";

test.describe("JsonViewer", () => {
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

  test("mostra os dados expandidos por padrão até defaultExpandDepth", async ({ page }) => {
    await expect(page.getByText('"Alice Chen"')).toBeVisible();
    await expect(page.getByText('"alice@example.com"')).toBeVisible();
  });

  test("nó colapsado tem aria-expanded=false e expande ao clicar", async ({ page }) => {
    const collapsedNode = page.getByRole("button", { name: "Expand" }).first();
    await expect(collapsedNode).toHaveAttribute("aria-expanded", "false");
    await collapsedNode.click();
    await expect(page.getByRole("button", { name: "Collapse" }).first()).toHaveAttribute("aria-expanded", "true");
  });
});
