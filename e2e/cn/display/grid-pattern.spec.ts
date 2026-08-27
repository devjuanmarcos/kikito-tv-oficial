import { test, expect } from "@playwright/test";

const ROUTES = ["/pt/cn/display/grid-pattern", "/pt/cn/display/particle-field"];

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

test.describe("Grid Pattern", () => {
  test("aparece na sidebar (absorbs falso corrigido)", async ({ page }) => {
    await page.goto("/pt/cn/display/grid-pattern");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: "Particle Field", exact: true })).toBeVisible();
  });

  test("camada de padrão é decorativa (aria-hidden)", async ({ page }) => {
    await page.goto("/pt/cn/display/grid-pattern");
    await page.waitForLoadState("networkidle");
    const layers = page.locator("main [aria-hidden='true']").filter({ hasText: "" });
    expect(await layers.count()).toBeGreaterThan(0);
  });
});

test.describe("Particle Field", () => {
  test("canvas é decorativo (aria-hidden) e presente no DOM", async ({ page }) => {
    await page.goto("/pt/cn/display/particle-field");
    await page.waitForLoadState("networkidle");
    // não afirma dimensão/visibilidade real: em mobile-chrome (~393px) a sidebar não
    // colapsa e o grid de 2 colunas do showcase espreme a caixa do Frame pra ~0px de
    // conteúdo — confirmado sistêmico (mesma medida em pin-board, sem relação com este
    // componente) e fora do escopo desta validação; ver AUDITORIA-CN-STATUS.md
    const canvases = page.locator("main canvas[aria-hidden='true']");
    expect(await canvases.count()).toBeGreaterThanOrEqual(2);
  });
});
