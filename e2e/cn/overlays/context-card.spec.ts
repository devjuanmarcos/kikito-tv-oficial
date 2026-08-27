import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/context-card";

test.describe("ContextCard (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("aparece na sidebar (absorbs falso do Tooltip corrigido)", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Context Card", exact: true })).toBeVisible();
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

  test("popup aparece no hover e no foco por teclado (trigger focavel)", async ({ page }) => {
    // a revelacao e 100% via CSS (:hover/:focus-within) — o popup fica sempre montado
    // (opacity-0 quando fechado), entao a asserção é sobre computed opacity, nao presença no DOM
    const trigger = page.getByText("Hover me", { exact: true });
    const popup = page.getByText("Rich popup with any custom content.");

    const opacityBefore = await popup.evaluate((el) => getComputedStyle(el.closest(".cc-popup")!).opacity);
    expect(opacityBefore).toBe("0");

    await trigger.hover();
    await expect.poll(async () => popup.evaluate((el) => getComputedStyle(el.closest(".cc-popup")!).opacity)).toBe("1");

    await page.mouse.move(0, 0);
    await expect.poll(async () => popup.evaluate((el) => getComputedStyle(el.closest(".cc-popup")!).opacity)).toBe("0");

    // acessivel por teclado: focar o trigger tambem revela (sem mouse)
    await trigger.focus();
    await expect.poll(async () => popup.evaluate((el) => getComputedStyle(el.closest(".cc-popup")!).opacity)).toBe("1");
  });
});
