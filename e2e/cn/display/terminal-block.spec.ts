import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/terminal-block";

test.describe("TerminalBlock", () => {
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

  test("linhas do transcript aparecem sem animação (default)", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("text=Terminal block").locator("..");
    await expect(frame.getByText("npm install @kikito/cn")).toBeVisible();
    await expect(frame.getByText("Ready on http://localhost:3000")).toBeVisible();
  });

  test("com prefers-reduced-motion, conteúdo completo aparece de imediato mesmo com animate", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    // page.reload() não reaplica a emulação de forma confiável nesta versão —
    // page.goto() fresco funciona (confirmado via teste diagnóstico isolado)
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    const frame = page.locator("text=Animated typing").locator("..");
    // sem esperar timer nenhum, a última linha já deve estar presente
    await expect(frame.getByText("Ready on http://localhost:3000")).toBeVisible();
  });
});
