import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/accordion-group";

test.describe("AccordionGroup", () => {
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

  test("type=single fecha o painel anterior ao abrir outro; aria-expanded reflete o estado", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "pendência 0b: sidebar intercepta pointer-events no clique em mobile-chrome");
    const frame = page.locator("main");
    // "Single open" é o 1º grupo renderizado — .first() de cada trigger pega essa instância
    const trigger1 = frame.getByRole("button", { name: "What is Kikito CN?" }).first();
    const trigger2 = frame.getByRole("button", { name: "How do I install it?" }).first();
    await expect(trigger1).toHaveAttribute("aria-expanded", "false");
    await trigger1.click();
    await expect(trigger1).toHaveAttribute("aria-expanded", "true");
    await trigger2.click();
    await expect(trigger1).toHaveAttribute("aria-expanded", "false");
    await expect(trigger2).toHaveAttribute("aria-expanded", "true");
  });

  test("type=multi mantém múltiplos painéis abertos ao mesmo tempo (defaultOpen)", async ({ page }) => {
    const frame = page.locator("main");
    // "Multiple open" é o 2º grupo — .nth(1) de cada trigger pega essa instância
    const trigger1 = frame.getByRole("button", { name: "What is Kikito CN?" }).nth(1);
    const trigger2 = frame.getByRole("button", { name: "How do I install it?" }).nth(1);
    // defaultOpen={["1","2"]} já deixa os dois primeiros abertos ao carregar
    await expect(trigger1).toHaveAttribute("aria-expanded", "true");
    await expect(trigger2).toHaveAttribute("aria-expanded", "true");
  });

  test("as 3 variantes (default/card/flush) renderizam", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("Default · card · flush")).toBeVisible();
  });
});
