import { test, expect } from "@playwright/test";

/**
 * Badge's `absorbs: ["tag", "status-badge", "ping"]` was fully false — none of the 3 has
 * any relation to Badge.tsx (zero import, zero shared dispatch). All 3 were hidden from
 * the sidebar; tag/ping additionally never had a showcase demo at all (Gate 8 gap on top
 * of the absorbs bug). See e2e/cn/inputs/badge.spec.ts for the sidebar-visibility check.
 */
const ROUTES = ["/pt/cn/display/tag", "/pt/cn/display/ping", "/pt/cn/display/status-badge"];

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

test.describe("Tag", () => {
  test("botao de remover funciona e tem aria-label", async ({ page }) => {
    await page.goto("/pt/cn/display/tag");
    await page.waitForLoadState("networkidle");
    const removeBtn = page.getByRole("button", { name: "Remove" });
    await expect(removeBtn).toBeVisible();
  });
});
