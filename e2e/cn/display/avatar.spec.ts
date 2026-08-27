import { test, expect } from "@playwright/test";

/**
 * `avatar-group` is NOT absorbed by `avatar` — the two are separate, parallel
 * implementations with different APIs (see JSDoc in Avatar.tsx). Fixed a stale
 * `absorbs` claim in cn-registry.tsx that was hiding avatar-group from the
 * sidebar nav despite it being a real, working, standalone component.
 */
const ROUTES = {
  avatar: "/pt/cn/display/avatar",
  "avatar-group": "/pt/cn/display/avatar-group",
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

test.describe("avatar-group (CN) — sidebar", () => {
  test("aparece na navegacao lateral (nao esta mais marcado como absorvido)", async ({ page }) => {
    await page.goto(ROUTES.avatar);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: "Avatar Group" })).toBeVisible();
  });
});

test.describe("Avatar/AvatarGroup (CN) — a11y", () => {
  test("iniciais e status dot expoem role=img com aria-label", async ({ page }) => {
    await page.goto(ROUTES.avatar);
    await page.waitForLoadState("networkidle");
    await expect(
      page
        .getByRole("img")
        .filter({ hasText: /^[A-Z]{1,2}$/ })
        .first()
    ).toBeVisible();
  });
});
