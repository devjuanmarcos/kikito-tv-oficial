import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/radio";

test.describe("Radio", () => {
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

  test("controlado: clicar noutra opção troca a seleção (radiogroup nativo)", async ({ page }) => {
    const frame = page.locator('text="Vertical (default)"').locator("..");
    await expect(frame.locator('input[value="pro"]')).toBeChecked();
    await frame.locator('input[value="enterprise"]').click({ force: true });
    await expect(frame.locator('input[value="enterprise"]')).toBeChecked();
    await expect(frame.locator('input[value="pro"]')).not.toBeChecked();
  });

  test("helperText fica associado via aria-describedby", async ({ page }) => {
    const frame = page.locator('text="Vertical (default)"').locator("..");
    const proInput = frame.locator('input[value="pro"]');
    const describedBy = await proInput.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("Unlimited projects + API access");
  });

  test("horizontal: navegação por seta troca seleção dentro do grupo nativo", async ({ page }) => {
    const frame = page.locator('text="Horizontal"').locator("..");
    await expect(frame.getByLabel("System")).toBeChecked();
    await frame.getByLabel("System").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(frame.getByLabel("Dark")).toBeChecked();
  });

  test('variant="card": preço/descrição visíveis, clicar no card inteiro seleciona (não só o dot)', async ({
    page,
  }) => {
    const frame = page.getByText("icon + descrição + preço, card inteiro clicável").locator("..");
    await expect(frame.getByText("$19", { exact: true })).toBeVisible();
    await expect(frame.getByText("For side projects", { exact: true })).toBeVisible();
    // clica no texto do label do card "Free" (bem longe do <input> real, escondido via sr-only) —
    // se o <label> não envolver o card inteiro, esse clique não selecionaria nada
    await frame.getByText("Free", { exact: true }).click();
    await expect(frame.locator('input[value="free"]')).toBeChecked();
  });
});
