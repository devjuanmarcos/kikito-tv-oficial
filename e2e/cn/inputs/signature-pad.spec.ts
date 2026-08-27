import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/signature-pad";

test.describe("SignaturePad (CN)", () => {
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

  test("canvas tem aria-label refletindo estado vazio/preenchido", async ({ page }) => {
    const canvas = page.locator("main canvas[role='img']").first();
    await expect(canvas).toHaveAttribute("aria-label", "Signature pad, empty");

    // dispatch direto em vez de page.mouse: em mobile-chrome (hasTouch) o Chromium não
    // entrega mousedown/mousemove sintéticos igual num dispositivo real touch-only
    await canvas.dispatchEvent("mousedown", { clientX: 20, clientY: 20 });
    await canvas.dispatchEvent("mousemove", { clientX: 100, clientY: 60 });
    await canvas.dispatchEvent("mouseup", { clientX: 100, clientY: 60 });

    await expect(canvas).toHaveAttribute("aria-label", "Signature pad, signature drawn");
  });

  test("Save fica desabilitado ate desenhar, Clear reseta", async ({ page }) => {
    const saveBtn = page.getByRole("button", { name: "Save" }).first();
    await expect(saveBtn).toBeDisabled();

    const canvas = page.locator("main canvas").first();
    await canvas.dispatchEvent("mousedown", { clientX: 20, clientY: 20 });
    await canvas.dispatchEvent("mousemove", { clientX: 100, clientY: 60 });
    await canvas.dispatchEvent("mouseup", { clientX: 100, clientY: 60 });
    await expect(saveBtn).toBeEnabled();

    await page.getByRole("button", { name: "Clear" }).first().click();
    await expect(saveBtn).toBeDisabled();
  });
});
