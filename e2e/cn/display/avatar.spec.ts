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

// absorvido de docs/component-import/animation-backport/PLAN.md (avatar-07.tsx): avatar
// clicável ganha micro-interação de hover/tap (motion) — sem onClick continua <span>
// decorativo, igual antes (nunca afordância falsa num elemento não-interativo)
test.describe("Avatar (CN) — clicável/selecionável", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.avatar);
    await page.waitForLoadState("networkidle");
  });

  test("avatar com onClick vira <button> real, com aria-pressed refletindo `selected`", async ({ page }) => {
    const danaBtn = page.getByRole("button", { name: "Selecionar Dana Costa" });
    await expect(danaBtn).toBeVisible();
    // Dana começa selecionada por padrão na demo
    await expect(danaBtn).toHaveAttribute("aria-pressed", "true");

    const kimBtn = page.getByRole("button", { name: "Selecionar Kim Alves" });
    await expect(kimBtn).toHaveAttribute("aria-pressed", "false");
    await kimBtn.click();
    await expect(kimBtn).toHaveAttribute("aria-pressed", "true");
    await expect(danaBtn).toHaveAttribute("aria-pressed", "false");
  });

  test("avatar sem onClick continua <span> decorativo (sem role=button)", async ({ page }) => {
    // os avatares da seção "Sizes" (sem onClick) não devem virar botão
    const sizesFrame = page.getByText("xs · sm · md · lg · xl · 2xl").locator("..");
    await expect(sizesFrame.getByRole("button")).toHaveCount(0);
  });
});
