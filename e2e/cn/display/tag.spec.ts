import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/tag";

test.describe("Tag", () => {
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

  test("clicável responde a clique e a teclado (Enter)", async ({ page }) => {
    const frame = page.locator("main");
    const clickable = frame.getByRole("button", { name: /^Clickable \(\d+\)$/ });
    await clickable.click();
    await expect(frame.getByRole("button", { name: "Clickable (1)" })).toBeVisible();
    await clickable.focus();
    await clickable.press("Enter");
    await expect(frame.getByRole("button", { name: "Clickable (2)" })).toBeVisible();
  });

  test("achado real corrigido: onClick + removable juntos não geram <button> aninhado", async ({ page }) => {
    const frame = page.locator("main");
    const combo = frame.locator('span[role="button"]').filter({ hasText: "Clickable + removable" });
    await expect(combo).toBeVisible();
    // o outer não é mais <button> (agora span role=button) -> tagName precisa ser SPAN
    const tag = await combo.evaluate((el) => el.tagName);
    expect(tag).toBe("SPAN");
    // botão de remover aninhado continua sendo um <button> real e clicável isoladamente
    const removeBtn = combo.getByRole("button", { name: "Remove" });
    await expect(removeBtn).toBeVisible();
  });

  test("botão de remover tem label específico com o texto da tag", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByRole("button", { name: "Remove Removable" })).toBeVisible();
  });
});
