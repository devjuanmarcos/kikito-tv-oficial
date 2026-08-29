import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/stepper";

test.describe("Stepper", () => {
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

  test("expõe role=list/listitem e aria-current=step no passo ativo", async ({ page }) => {
    const frame = page.locator("main");
    const list = frame.getByRole("list").first();
    await expect(list.locator('[aria-current="step"]')).toHaveCount(1);
  });

  test("achado real corrigido: avançar e voltar habilita círculo clicável navegável por teclado (Enter)", async ({
    page,
  }) => {
    const frame = page.locator("main");
    await frame.getByRole("button", { name: "Next" }).click();
    // passo 0 (Account) agora está completo e clickable=true -> vira <button>
    const step0Circle = frame.getByRole("button", { name: /Go to step 1: Account/ });
    await expect(step0Circle).toBeVisible();
    await step0Circle.focus();
    await step0Circle.press("Enter");
    // voltou pro passo 0 -> botão "Back" fica desabilitado (isFirst)
    await expect(frame.getByRole("button", { name: "Back" })).toBeDisabled();
  });

  test("vertical: step opcional e step com erro renderizam com os tokens certos", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("(optional)", { exact: true })).toBeVisible();
    await expect(frame.getByText("Shipping issue")).toHaveClass(/text-danger/);
  });
});
