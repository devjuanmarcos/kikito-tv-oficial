import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/context-card";

test.describe("ContextCard (CN)", () => {
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

  // Aposentado na auditoria (docs/AUDITORIA-CN-STATUS.md): ContextCard virou wrapper genuíno
  // sobre `Tooltip variant="card"` (antigo HoverCard) — a revelação agora é via JS/portal
  // (role="tooltip"), não mais CSS puro (:hover/:focus-within com classe .cc-popup)
  test("popup aparece no hover via portal com role=tooltip", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Hover me" });
    await trigger.hover();
    const card = page.getByRole("tooltip").filter({ hasText: "Rich popup with any custom content." });
    await expect(card).toBeVisible();
  });

  test("acessível por teclado: foco no trigger também revela o popup", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Right side" });
    await trigger.focus();
    const card = page.getByRole("tooltip").filter({ hasText: "Opens to the right" });
    await expect(card).toBeVisible();
  });

  // achado real corrigido: delay era documentado "não implementado" quando a revelação era só
  // CSS — agora que delega pro Tooltip (openDelay/closeDelay reais), o prop funciona de verdade
  test("achado real corrigido: delay agora funciona de verdade (era no-op antes)", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Slow reveal (600ms)" });
    await trigger.hover();
    const card = page.getByRole("tooltip").filter({ hasText: "era no-op antes" });
    // não deve aparecer imediatamente (delay=600ms)
    await expect(card).not.toBeVisible({ timeout: 100 });
    await expect(card).toBeVisible({ timeout: 1000 });
  });
});
