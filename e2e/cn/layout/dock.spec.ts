import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/dock";

test.describe("Dock", () => {
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

  test("8 apps renderizam, tooltip mostra o nome no hover", async ({ page }) => {
    const frame = page.locator("text=Mova o mouse sobre os ícones").locator("..");
    const icons = frame.locator("[role='button']");
    await expect(icons).toHaveCount(8);
    await icons.first().hover();
    await expect(page.getByText("Finder", { exact: true })).toBeVisible();
  });

  test("apps abertos mostram dot indicador", async ({ page }) => {
    const frame = page.locator("text=Mova o mouse sobre os ícones").locator("..");
    // demo abre com openApps=["finder","safari"] -- 2 dots visiveis
    const dots = frame.locator(".bg-patina");
    await expect(dots).toHaveCount(2);
  });

  test("clicar num app alterna o dot (achado real: onClick funciona e nao so o hover)", async ({ page }) => {
    const frame = page.locator("text=Mova o mouse sobre os ícones").locator("..");
    const icons = frame.locator("[role='button']");
    const before = await frame.locator(".bg-patina").count();
    // "calculator" (2o icone) comeca fechado -- clicar deve abrir e adicionar 1 dot
    await icons.nth(1).click();
    await expect(frame.locator(".bg-patina")).toHaveCount(before + 1);
  });

  test("magnificacao por proximidade: icone perto do mouse fica maior que os das pontas", async ({ page }) => {
    const frame = page.locator("text=Mova o mouse sobre os ícones").locator("..");
    const icons = frame.locator("[role='button']");
    const firstBoxBefore = await icons.first().boundingBox();
    const middleBox = await icons.nth(4).boundingBox();
    if (!middleBox) throw new Error("sem bounding box");
    await page.mouse.move(middleBox.x + middleBox.width / 2, middleBox.y + middleBox.height / 2, { steps: 10 });
    await page.waitForTimeout(500);
    const middleBoxAfter = await icons.nth(4).boundingBox();
    const firstBoxAfter = await icons.first().boundingBox();
    if (!middleBoxAfter || !firstBoxAfter || !firstBoxBefore) throw new Error("sem bounding box");
    // icone sob o mouse cresce; icone na ponta (longe do efeito) continua do tamanho original
    expect(middleBoxAfter.width).toBeGreaterThan(middleBox.width * 1.1);
    expect(firstBoxAfter.width).toBeCloseTo(firstBoxBefore.width, 0);
  });
});
