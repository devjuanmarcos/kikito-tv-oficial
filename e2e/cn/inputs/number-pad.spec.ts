import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/number-pad";

test.describe("NumberPad (CN)", () => {
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

  // clique real em mobile-chrome falha por causa da pendência sistêmica já catalogada em
  // AUDITORIA-CN-STATUS.md (0b): a sidebar do showcase não colapsa em ~393px e intercepta
  // pointer events sobre o conteúdo — não é bug do NumberPad, é o layout do showcase
  test("digitar atualiza o status ao vivo (feedback pra leitor de tela)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    const group = page.getByRole("group", { name: "Number pad" }).first();
    await group.getByRole("button", { name: "1", exact: true }).click();
    await group.getByRole("button", { name: "2", exact: true }).click();
    const status = page.getByRole("status").filter({ hasText: "digits entered" }).first();
    await expect(status).toHaveText("2 of 4 digits entered");
  });

  test("Backspace tem aria-label e remove o ultimo digito", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    const group = page.getByRole("group", { name: "Number pad" }).first();
    const backspace = group.getByRole("button", { name: "Backspace" });
    await expect(backspace).toBeVisible();
    await group.getByRole("button", { name: "5", exact: true }).click();
    await backspace.click();
    const status = page.getByRole("status").filter({ hasText: "digits entered" }).first();
    await expect(status).toHaveText("0 of 4 digits entered");
  });
});
