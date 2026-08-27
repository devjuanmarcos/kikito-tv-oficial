import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/checkbox";

test.describe("Checkbox (CN)", () => {
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

  test("clique alterna o estado (controlado)", async ({ page }) => {
    // o <input> real fica sr-only (1x1px) — Playwright nao consegue mirar nele direto;
    // clicar no <label> visivel e o caminho real de uso (forward nativo do browser)
    const checkbox = page.getByRole("checkbox", { name: "Enable notifications" });
    const label = page.locator("label").filter({ hasText: "Enable notifications" });
    await expect(checkbox).not.toBeChecked();
    await label.click();
    await expect(checkbox).toBeChecked();
  });

  test("teclado: Tab foca e Space alterna", async ({ page }) => {
    const checkbox = page.getByRole("checkbox", { name: "Enable notifications" });
    await checkbox.focus();
    await expect(checkbox).toBeFocused();
    await page.keyboard.press("Space");
    await expect(checkbox).toBeChecked();
  });

  test("foco visivel: caixa customizada reflete :focus-visible do input real", async ({ page }) => {
    const checkbox = page.getByRole("checkbox", { name: "Enable notifications" });
    const box = checkbox.locator("xpath=..");

    // outline-width tem valor inicial "medium" (~3px) mesmo sem regra nenhuma — o que importa
    // e outline-style, que so vira "solid" quando has-[:focus-visible] realmente ativa
    const styleBefore = await box.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(styleBefore).toBe("none");

    await checkbox.focus();
    const styleAfter = await box.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(styleAfter).toBe("solid");
  });
});
