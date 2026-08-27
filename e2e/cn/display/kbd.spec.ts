import { test, expect } from "@playwright/test";

/**
 * Kbd absorbs shortcut-key for real (ShortcutKey.tsx is a genuine thin
 * backward-compat wrapper delegating to KbdSequence) — unlike the false
 * `absorbs` claims found on avatar/accordion. `display/kbd` itself had no
 * demo at all before this fix (never imported in _showcase.tsx), same
 * orphaned-page class as collapsible/tree-view.
 */
const ROUTES = {
  kbd: "/pt/cn/display/kbd",
  "shortcut-key": "/pt/cn/display/shortcut-key",
};

for (const [name, url] of Object.entries(ROUTES)) {
  test.describe(`${name} (CN)`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
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
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
    });
  });
}

test.describe("Kbd (CN) — conteudo", () => {
  test("mostra as chaves de exemplo", async ({ page }) => {
    await page.goto(ROUTES.kbd);
    await page.waitForLoadState("networkidle");
    // scoped to main: a página tem um <kbd> global de dica de atalho (cnh-kbd) fora do conteúdo da demo
    await expect(page.locator("main kbd").first()).toBeVisible();
  });
});
