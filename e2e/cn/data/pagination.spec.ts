import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/pagination";

test.describe("Pagination", () => {
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

  test("página 1 tem aria-current=page e botão 'First page' desabilitado", async ({ page }) => {
    const first = page.getByRole("button", { name: "First page" }).first();
    await expect(first).toBeDisabled();
    const pageOne = page.getByRole("button", { name: "Page 1", exact: true }).first();
    await expect(pageOne).toHaveAttribute("aria-current", "page");
  });

  test("clicar em 'Next page' avança a página em ambas as instâncias (estado compartilhado)", async ({ page }) => {
    await page.getByRole("button", { name: "Next page" }).first().click();
    const pageTwoButtons = page.getByRole("button", { name: "Page 2" });
    await expect(pageTwoButtons).toHaveCount(2);
    for (const btn of await pageTwoButtons.all()) {
      await expect(btn).toHaveAttribute("aria-current", "page");
    }
  });

  test("range label mostra contagem de itens", async ({ page }) => {
    await expect(page.getByText("1–20 of 240")).toBeVisible();
  });

  // absorvido de docs/component-import/animation-backport/PLAN.md (pagination-01, versão
  // adapted/): fundo da página ativa desliza via motion layoutId em vez de trocar instantâneo.
  // A demo tem 2 instâncias de <Pagination> com o mesmo `page` (estado compartilhado) mas
  // layoutId independente (useId por instância) — testa que não colidem mesmo mostrando a
  // mesma página ativa ao mesmo tempo.
  test("indicador deslizante: cada instância tem sua própria barra, mesmo mostrando a mesma página ativa", async ({
    page,
  }) => {
    const activeButtons = page.getByRole("button", { name: "Page 1", exact: true });
    await expect(activeButtons).toHaveCount(2);
    for (const btn of await activeButtons.all()) {
      await expect(btn.locator("span.absolute")).toHaveCount(1);
    }
  });

  test("indicador deslizante: migra pra página nova ao clicar em 'Next page'", async ({ page }) => {
    await page.getByRole("button", { name: "Next page" }).first().click();
    const pageOneButtons = page.getByRole("button", { name: "Page 1", exact: true });
    await expect(pageOneButtons).toHaveCount(2);
    for (const btn of await pageOneButtons.all()) {
      await expect(btn.locator("span.absolute")).toHaveCount(0);
    }
    const pageTwoButtons = page.getByRole("button", { name: "Page 2" });
    for (const btn of await pageTwoButtons.all()) {
      await expect(btn.locator("span.absolute")).toHaveCount(1);
    }
  });
});
