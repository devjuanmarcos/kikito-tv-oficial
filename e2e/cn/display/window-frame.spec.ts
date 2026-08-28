import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/window-frame";

test.describe("WindowFrame", () => {
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

  test("os 3 variantes reais renderizam (macos/windows/minimal), nenhum fantasma", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("index.tsx")).toBeVisible();
    await expect(frame.getByText("Notepad — untitled.txt")).toBeVisible();
    await expect(frame.getByText("Content goes here")).toBeVisible();
  });

  test("barra de URL aparece quando a prop url é passada", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("https://kikito.dev")).toBeVisible();
  });

  test("chrome decorativo (traffic lights / botões de janela) não expõe nenhum <button> falso", async ({ page }) => {
    // achado real: os glifos ─/□/✕ eram <button> reais sem onClick nenhum (afordância
    // falsa) — agora são spans aria-hidden, igual aos traffic lights do macOS
    const frame = page.locator("main");
    await expect(frame.getByRole("button", { name: /[─□✕]/ })).toHaveCount(0);
  });
});
