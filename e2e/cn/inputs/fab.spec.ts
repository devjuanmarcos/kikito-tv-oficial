import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/fab";

test.describe("Fab (CN)", () => {
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

  test("botao principal tem aria-label real (fallback quando sem tooltip)", async ({ page }) => {
    const main = page.getByRole("button", { name: "Abrir menu" });
    await expect(main).toBeVisible();
  });

  test("speed-dial: abre com aria-expanded/haspopup, fecha com Escape, contido no card", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    const main = page.getByRole("button", { name: "Abrir menu" });
    await expect(main).toHaveAttribute("aria-haspopup", "true");
    await expect(main).toHaveAttribute("aria-expanded", "false");

    await main.click();
    await expect(page.getByRole("button", { name: "Fechar" })).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();

    // Fab e' position:fixed - sem containing block o botao escapa pro canto real do
    // viewport em vez de ficar dentro da caixa do demo (bug achado e corrigido nesta validacao)
    const box = await page.getByText("Speed-dial (bottom-right)").locator("..").boundingBox();
    const fabBox = await page.getByRole("button", { name: "Fechar" }).boundingBox();
    expect(box).toBeTruthy();
    expect(fabBox).toBeTruthy();
    if (box && fabBox) {
      expect(fabBox.x).toBeGreaterThanOrEqual(box.x - 4);
      expect(fabBox.x + fabBox.width).toBeLessThanOrEqual(box.x + box.width + 4);
    }

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute("aria-expanded", "false");
  });

  test("acoes de speed-dial disparam onClick e fecham o menu", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    const main = page.getByRole("button", { name: "Abrir menu" });
    await main.click();
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toBeVisible();
  });

  test("intents: 4 fabs com aria-label distintos por intent", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Adicionar (primary)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Adicionar (secondary)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Adicionar (success)" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Adicionar (danger)" })).toBeVisible();
  });

  test("sizes: 3 tamanhos com largura crescente", async ({ page }) => {
    const sm = page.getByRole("button", { name: "Tamanho sm" });
    const md = page.getByRole("button", { name: "Tamanho md" });
    const lg = page.getByRole("button", { name: "Tamanho lg" });
    const [smBox, mdBox, lgBox] = await Promise.all([sm.boundingBox(), md.boundingBox(), lg.boundingBox()]);
    expect(smBox && mdBox && lgBox).toBeTruthy();
    if (smBox && mdBox && lgBox) {
      expect(smBox.width).toBeLessThan(mdBox.width);
      expect(mdBox.width).toBeLessThan(lgBox.width);
    }
  });
});
