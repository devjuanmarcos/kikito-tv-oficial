import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/badge";

test.describe("Badge (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("tag/status-badge/ping aparecem na sidebar (absorbs falso corrigido)", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Tag", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Status Badge", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Ping", exact: true })).toBeVisible();
  });

  test("dark mode: pagina nao quebra ao alternar", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("animated: rótulo revelado letra-por-letra é acessível via aria-label, spans com aria-hidden", async ({
    page,
  }) => {
    const frame = page.locator('text="animated — glow ambiente + ícone pop-in + rótulo letra-por-letra"').locator("..");
    const label = frame.getByLabel("Success", { exact: true });
    await expect(label).toBeVisible();
    const hiddenChars = label.locator('[aria-hidden="true"]');
    await expect(hiddenChars).not.toHaveCount(0);
    // texto ainda legível de verdade — cada char aparece no DOM, só marcado aria-hidden
    // individualmente (o wrapper com aria-label é que carrega a semântica pro leitor de tela)
    await expect(label).toContainText("Success");
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
});
