import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/rich-select";

test.describe("RichSelect", () => {
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

  test("selecionar opção atualiza o valor exibido", async ({ page }, testInfo) => {
    // pendência 0b: em mobile-chrome (~393px) a sidebar do showcase não colapsa e espreme
    // o conteúdo — o botão do trigger fica com clique não-confiável (elemento instável/fora
    // do viewport). Achado sistêmico, não é bug do RichSelect. Ver docs/AUDITORIA-CN-STATUS.md.
    test.skip(
      testInfo.project.name === "mobile-chrome",
      "pendência 0b — sidebar do showcase espreme o conteúdo em mobile-chrome"
    );
    const frame = page.locator('text="Rich Select — single value with icon and description"').locator("..");
    await frame.getByRole("button").click();
    await frame.getByRole("option", { name: /Kinpaku/ }).click();
    await expect(frame.getByText("Selected: kinpaku")).toBeVisible();
  });

  test("badge e opção desabilitada aparecem, disabled não é selecionável", async ({ page }) => {
    const frame = page.locator('text="Com badge e opção desabilitada"').locator("..");
    await frame.getByRole("button").click();
    await expect(frame.getByText("Popular")).toBeVisible();
    const enterprise = frame.getByRole("option", { name: /Enterprise/ });
    await expect(enterprise).toHaveAttribute("aria-disabled", "true");
  });
});
