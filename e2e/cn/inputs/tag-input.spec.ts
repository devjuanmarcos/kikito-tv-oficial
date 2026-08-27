import { test, expect } from "@playwright/test";

/**
 * Registrado no cn-registry.tsx mas nunca importado/wired em _showcase.tsx — página
 * renderizava "não encontrada" (mesma classe de bug já fechada em ~35 outras páginas
 * em sessões anteriores). Demo criada e wired nesta validação.
 */
const URL = "/pt/cn/inputs/tag-input";

test.describe("TagInput (CN)", () => {
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

  test("Enter cria tag, Backspace no campo vazio remove a ultima", async ({ page }) => {
    const input = page.getByLabel("Add tag…").first();
    await input.fill("kikito");
    await input.press("Enter");
    await expect(page.getByRole("button", { name: "Remove kikito" })).toBeVisible();

    await input.press("Backspace");
    await expect(page.getByRole("button", { name: "Remove kikito" })).not.toBeAttached();
  });

  test("clicar no X de uma tag remove so ela", async ({ page }) => {
    const removeBtn = page.getByRole("button", { name: "Remove design" });
    await expect(removeBtn).toBeVisible();
    await removeBtn.click();
    await expect(removeBtn).not.toBeAttached();
    await expect(page.getByRole("button", { name: "Remove react" })).toBeVisible();
  });

  test("max atingido esconde o campo de digitacao", async ({ page }) => {
    const input = page.getByLabel("Add tag (max 3)…");
    await expect(input).toBeVisible();
    await input.fill("three");
    await input.press("Enter");
    await expect(input).not.toBeAttached();
  });
});
