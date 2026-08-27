import { test, expect } from "@playwright/test";

const ROUTES = ["/pt/cn/layout/scroll-spy", "/pt/cn/layout/table-of-contents"];

for (const url of ROUTES) {
  test.describe(`rota ${url}`, () => {
    test("renderiza sem crash e sem erros de console", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await expect(page).not.toHaveTitle(/Error|500|404/);
      await expect(page.locator("main")).toBeVisible();
      expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
    });
  });
}

test.describe("Scroll Spy", () => {
  test("aparece na sidebar (absorbs falso corrigido)", async ({ page }) => {
    await page.goto("/pt/cn/layout/scroll-spy");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: "Table of Contents", exact: true })).toBeVisible();
  });

  test("clique marca item como ativo (aria-current)", async ({ page }) => {
    await page.goto("/pt/cn/layout/scroll-spy");
    await page.waitForLoadState("networkidle");
    const nav = page.locator("main nav").first();
    const item = nav.getByRole("button", { name: "Configuration" });
    await item.click();
    await expect(item).toHaveAttribute("aria-current", "true");
  });
});

test.describe("Table of Contents", () => {
  test("clique atualiza item ativo (aria-current, modo controlado)", async ({ page }) => {
    await page.goto("/pt/cn/layout/table-of-contents");
    await page.waitForLoadState("networkidle");
    const item = page.getByRole("button", { name: "Colors" });
    await item.click();
    await expect(item).toHaveAttribute("aria-current", "true");
    await expect(page.getByRole("button", { name: "Introduction" })).not.toHaveAttribute("aria-current", "true");
  });
});
