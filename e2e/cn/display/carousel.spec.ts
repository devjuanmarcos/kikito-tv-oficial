import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/carousel";

test.describe("Carousel", () => {
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

  test("botão Next avança slide e reflete aria-hidden/aria-current corretamente", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar intercepta pointer-events no clique em mobile-chrome");
    const frame = page.locator("main");
    const region = frame.getByRole("region", { name: "Carousel" }).first();
    // getByRole exclui elementos aria-hidden da árvore de acessibilidade (correto, é o
    // comportamento real de leitor de tela) — pra checar o PRÓPRIO estado de aria-hidden
    // (que começa true pro slide 2), precisa de um seletor que não filtre por isso
    const slide1 = region.locator('[aria-label="Slide 1 of 4"]');
    const slide2 = region.locator('[aria-label="Slide 2 of 4"]');
    await expect(slide1).toHaveAttribute("aria-hidden", "false");
    await expect(slide2).toHaveAttribute("aria-hidden", "true");
    await region.getByRole("button", { name: "Next" }).click();
    await expect(slide1).toHaveAttribute("aria-hidden", "true");
    await expect(slide2).toHaveAttribute("aria-hidden", "false");
    await expect(region.getByRole("button", { name: "Go to slide 2" })).toHaveAttribute("aria-current", "true");
  });

  test("orientation vertical: só o slide atual é visível (clipping real, não empilhado)", async ({ page }) => {
    const frame = page.locator("main");
    const verticalRegion = frame.getByRole("region", { name: "Carousel" }).nth(1);
    const box = await verticalRegion.boundingBox();
    expect(box).not.toBeNull();
    // achado real corrigido: sem h-full na trilha, os 4 slides empilhavam e o container
    // crescia pra caber todos (~4x a altura configurada) — agora deve ficar preso à altura
    // explícita do className (h-56 = 224px)
    expect(box!.height).toBeLessThan(260);
    await expect(verticalRegion.locator('[aria-label="Slide 2 of 4"]')).toHaveAttribute("aria-hidden", "true");
  });

  test('indicator="counter" mostra "N / total" e atualiza ao avançar', async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar intercepta pointer-events no clique em mobile-chrome");
    const frame = page.locator("main");
    const counterRegion = frame.getByRole("region", { name: "Carousel" }).nth(2);
    await expect(counterRegion.getByText("1 / 4", { exact: true })).toBeVisible();
    await counterRegion.getByRole("button", { name: "Next" }).click();
    await expect(counterRegion.getByText("2 / 4", { exact: true })).toBeVisible();
  });
});
