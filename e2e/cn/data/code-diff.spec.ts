import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/code-diff";

test.describe("CodeDiff", () => {
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

  test("unificado: linha removida e linha adicionada têm fundo destacado (bg-danger-soft/bg-success-soft)", async ({
    page,
  }) => {
    const frame = page.locator("main");
    // "Removed:"/conteúdo aparece tanto na tabela unificada quanto na coluna esquerda do
    // split view (mesma linha do diff, dois modos de exibição) — .first() pega a unificada
    const removedRow = frame.locator("tr", { hasText: 'console.log("Hello, " + name)' }).first();
    const addedRow = frame.locator("tr", { hasText: "const msg = " }).first();
    await expect(removedRow).toHaveClass(/bg-danger-soft/);
    await expect(addedRow).toHaveClass(/bg-success-soft/);
  });

  test("achado real corrigido: split view mostra highlight de diferença, não texto neutro", async ({ page }) => {
    const frame = page.locator("main");
    // split view é a 2ª seção da demo — pega as tabelas depois da 1ª (unificada)
    const splitTables = frame.locator("table[role='presentation']");
    const count = await splitTables.count();
    expect(count).toBeGreaterThanOrEqual(3); // 1 unificada + 2 colunas do split
    const highlighted = frame.locator("tr.bg-danger-soft, tr.bg-success-soft");
    // com o fix, tanto a tabela unificada quanto as duas colunas do split contribuem linhas
    // destacadas — sem o fix, o split teria zero (before/after cru, sem highlight)
    const highlightedCount = await highlighted.count();
    expect(highlightedCount).toBeGreaterThan(2);
  });

  test("números de linha ficam aria-hidden (decoração visual, não conteúdo)", async ({ page }) => {
    const frame = page.locator("main");
    const lineNumberCell = frame.locator('td[aria-hidden="true"]').first();
    await expect(lineNumberCell).toBeVisible();
  });
});
