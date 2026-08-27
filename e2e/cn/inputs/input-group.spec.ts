import { test, expect } from "@playwright/test";

/**
 * Registrado no cn-registry.tsx mas nunca importado/referenciado em _showcase.tsx —
 * mesma classe de bug já fechada em outras páginas nesta sessão. Demo criada e wired
 * nesta validação.
 */
const URL = "/pt/cn/inputs/input-group";

test.describe("InputGroup (CN)", () => {
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

  test("prefixo e sufixo de texto aparecem ao redor do input real", async ({ page }) => {
    await expect(page.getByText("https://")).toBeVisible();
    await expect(page.getByText(".com", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Domain")).toHaveValue("kikito");
  });

  test("instancia disabled espelha disabled no input real (nao so visual)", async ({ page }) => {
    const disabledInput = page.getByLabel("Amount").last();
    await expect(disabledInput).toBeDisabled();
  });
});
