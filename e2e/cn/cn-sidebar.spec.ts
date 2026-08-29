import { test, expect } from "@playwright/test";

// Achado sistêmico da auditoria (pendência 0b, docs/AUDITORIA-CN-STATUS.md): a sidebar do
// showcase nunca colapsava abaixo de 860px — o conteúdo ficava espremido a ~0px úteis,
// quebrando canvas/SVG e sentinels de IntersectionObserver em várias demos. Corrigido virando
// um drawer (fixed+translateX+backdrop) controlado pelo botão de menu no header, com
// auto-close ao navegar, Escape, clique no backdrop e `inert` no fechado (fora do tab order).
test.describe("CN sidebar mobile drawer (pendência 0b)", () => {
  test("desktop (>=860px): sidebar estática, sem hamburguer, sem squeeze", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/pt/cn/display/tag");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("button", { name: "Abrir navegação" })).toHaveCount(0);
    const aside = page.locator("aside.cn-aside");
    await expect(aside).toBeVisible();
    const box = await aside.boundingBox();
    expect(box?.width).toBeGreaterThan(200);
  });

  test("mobile (<860px): sidebar escondida por padrão, hamburguer abre drawer", async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 800 });
    await page.goto("/pt/cn/display/tag");
    await page.waitForLoadState("networkidle");
    const menuBtn = page.getByRole("button", { name: "Abrir navegação" });
    await expect(menuBtn).toBeVisible();

    const aside = page.locator("aside.cn-aside");
    // fechada: translateX(-100%) e inert (fora do tab order)
    await expect(aside).not.toHaveClass(/cn-aside--open/);
    await expect(aside).toHaveJSProperty("inert", true);

    await menuBtn.click();
    await expect(aside).toHaveClass(/cn-aside--open/);
    await expect(aside).toHaveJSProperty("inert", false);
    await expect(aside.getByRole("link").first()).toBeVisible();

    // Escape fecha
    await page.keyboard.press("Escape");
    await expect(aside).not.toHaveClass(/cn-aside--open/);

    // reabre e fecha clicando no backdrop
    await menuBtn.click();
    await expect(aside).toHaveClass(/cn-aside--open/);
    // clicar bem à direita da faixa da aside (268px) pra garantir que o alvo é o backdrop, não a aside
    await page.locator(".cn-backdrop").click({ position: { x: 500, y: 5 } });
    await expect(aside).not.toHaveClass(/cn-aside--open/);
  });

  test("mobile: navegar pra outro componente fecha o drawer automaticamente", async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 800 });
    await page.goto("/pt/cn/display/tag");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Abrir navegação" }).click();
    const aside = page.locator("aside.cn-aside");
    await expect(aside).toHaveClass(/cn-aside--open/);
    // "Callout" fica no grupo Display, já expandido por padrão (é o grupo da página atual)
    await aside.getByRole("link", { name: "Callout", exact: true }).click();
    await page.waitForLoadState("networkidle");
    await expect(aside).not.toHaveClass(/cn-aside--open/);
  });
});
