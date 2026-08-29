import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/quick-actions";

// Aposentado na auditoria (docs/AUDITORIA-CN-STATUS.md, pendência 4b): QuickActions virou
// wrapper genuíno sobre `Fab position="inline"` — o comportamento de "ação escondida" mudou
// de tabIndex=-1 (elemento montado, fora do tab order) pra desmontar de vez quando fechado
// (mesmo padrão que o Fab já usava antes da fusão), então as ações simplesmente não existem
// no DOM enquanto o menu está fechado.
test.describe("QuickActions", () => {
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

  test("nome acessível 'Quick actions' preservado depois da fusão com Fab", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Quick actions" }).first()).toBeVisible();
  });

  test("menu fechado: ação nem existe no DOM (achado real corrigido: mesma técnica do Fab)", async ({ page }) => {
    await expect(page.getByRole("button", { name: "New item", exact: true })).toHaveCount(0);
  });

  test("abrir o menu monta a ação (focável e clicável) e fecha ao clicar nela", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Quick actions" }).first();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const newItemButton = page.getByRole("button", { name: "New item", exact: true }).first();
    await expect(newItemButton).toBeVisible();
    await newItemButton.click();
    // clicar numa ação fecha o menu de volta
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByRole("button", { name: "New item", exact: true })).toHaveCount(0);
  });
});
