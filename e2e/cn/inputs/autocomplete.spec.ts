import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/autocomplete";

test.describe("Autocomplete (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("dark mode: pagina nao quebra ao alternar", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
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

  test("label esta associado ao input (htmlFor/id)", async ({ page }) => {
    const input = page.getByLabel("Framework");
    await expect(input).toBeVisible();
  });

  test("digitar filtra opcoes e ArrowDown+Enter seleciona", async ({ page }) => {
    const input = page.getByLabel("Framework");
    await input.fill("sve");
    const listbox = page.locator('[role="listbox"]');
    await expect(listbox).toBeVisible();
    await expect(listbox.getByText("Svelte")).toBeVisible();
    await expect(listbox.getByText("React")).toHaveCount(0);

    await input.press("ArrowDown");
    await input.press("Enter");
    await expect(input).toHaveValue("Svelte");
  });

  test("aria-activedescendant acompanha a opcao destacada", async ({ page }) => {
    const input = page.getByLabel("Framework");
    await input.fill("s");
    await expect(page.locator('[role="listbox"]')).toBeVisible();

    await input.press("ArrowDown");
    const activeId = await input.getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();
    const activeOption = page.locator(`#${activeId}`);
    await expect(activeOption).toHaveAttribute("role", "option");
  });
});
