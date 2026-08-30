import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/button";

test.describe("Button (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("dark mode: pagina nao quebra ao alternar", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
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

  test("confirm='doubleclick' real: clique real atualiza o label antes do auto-reset de 2s", async ({ page }) => {
    // achado da auditoria (docs/AUDITORIA-CN-STATUS.md, pendência 0c): um investigação anterior
    // concluiu que cliques reais (mouse/teclado/CDP) não atualizavam o DOM, só clique
    // programático funcionava — reproduzido aqui via MutationObserver no Browser pane ao vivo:
    // o label MUDA corretamente pra "Click again to confirm" e volta sozinho pra "Delete account"
    // exatos ~2000ms depois (resetDelay default). O "bug" era falso positivo: a asserção da
    // investigação anterior rodava depois da janela de 2s ter expirado (overhead de tooling/
    // screenshot entre o clique e a checagem), não um defeito real do componente. Este teste
    // usa timeout curto de propósito pra travar essa janela como regressão
    const btn = page.getByRole("button", { name: "Delete account" });
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await expect(page.getByRole("button", { name: "Click again to confirm" })).toBeVisible({ timeout: 300 });
    // e o auto-reset de fato acontece depois (resetDelay=2000ms), não fica preso em "confirming"
    await expect(page.getByRole("button", { name: "Delete account" })).toBeVisible({ timeout: 2500 });
  });

  test("effect='lift' sobe no hover", async ({ page, isMobile }) => {
    // achado real: Tailwind v4 usa a propriedade CSS `translate` separada
    // (não mais `transform: translateY(...)`) pras utilities translate-*/hover:translate-* —
    // checar `transform` aqui sempre daria "none" nos dois estados, falso negativo
    test.skip(
      isMobile,
      "mobile-chrome não reporta hover:hover (matchMedia confirmado false) — :hover não persiste em touch, mesmo comportamento de um dispositivo real"
    );
    const btn = page.getByRole("button", { name: "Lift on hover", exact: true });
    await btn.scrollIntoViewIfNeeded();
    const before = await btn.evaluate((el) => getComputedStyle(el).translate);
    await btn.hover();
    await expect.poll(async () => btn.evaluate((el) => getComputedStyle(el).translate)).not.toBe(before);
  });

  test("effect='reveal' expande iconRight de width 0 no hover", async ({ page, isMobile }) => {
    test.skip(isMobile, "mobile-chrome não reporta hover:hover — mesmo motivo do teste de lift acima");
    const btn = page.getByRole("button", { name: "Learn more", exact: true });
    await btn.scrollIntoViewIfNeeded();
    const icon = btn.locator("span[aria-hidden='true']").last();
    const before = await icon.evaluate((el) => getComputedStyle(el).width);
    expect(before).toBe("0px");
    await btn.hover();
    await expect.poll(async () => icon.evaluate((el) => getComputedStyle(el).width)).not.toBe("0px");
  });

  test("effect='radial-fill' seta --rf-x/--rf-y no mousemove", async ({ page }) => {
    const btn = page.getByRole("button", { name: "Hover anywhere", exact: true });
    await btn.scrollIntoViewIfNeeded();
    const box = await btn.boundingBox();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    const x = await btn.evaluate((el) => (el as HTMLElement).style.getPropertyValue("--rf-x"));
    expect(x).not.toBe("");
  });

  test("effect='shine' sweep de luz muda translate no hover", async ({ page, isMobile }) => {
    test.skip(isMobile, "mobile-chrome não reporta hover:hover — mesmo motivo do teste de lift acima");
    const btn = page.getByRole("button", { name: "Shine on hover", exact: true });
    await btn.scrollIntoViewIfNeeded();
    const overlay = btn.locator("span[aria-hidden='true']").first();
    const before = await overlay.evaluate((el) => getComputedStyle(el).translate);
    await btn.hover();
    await expect.poll(async () => overlay.evaluate((el) => getComputedStyle(el).translate)).not.toBe(before);
  });
});
