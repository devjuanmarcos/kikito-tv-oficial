import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/toggle-group";

test.describe("ToggleGroup (CN)", () => {
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

  test("single: clicar troca aria-pressed exclusivamente", async ({ page }) => {
    // [role=group] dentro de <main>: index 0 e um wrapper nao relacionado (sem botoes),
    // index 1 = toggle group "single", index 2 = "multiple" (ordem confirmada via debug)
    const groups = page.locator("main").getByRole("group");
    const singleGroup = groups.nth(1);
    const bold = singleGroup.getByRole("button", { name: "B" });
    const italic = singleGroup.getByRole("button", { name: "I" });

    await expect(bold).toHaveAttribute("aria-pressed", "true");
    await italic.click();
    await expect(italic).toHaveAttribute("aria-pressed", "true");
    await expect(bold).toHaveAttribute("aria-pressed", "false");
  });

  test("multiple: clicar acumula selecao", async ({ page }) => {
    const groups = page.locator("main").getByRole("group");
    const multiGroup = groups.nth(2);
    const underline = multiGroup.getByRole("button", { name: "U" });

    await expect(underline).toHaveAttribute("aria-pressed", "false");
    await underline.click();
    await expect(underline).toHaveAttribute("aria-pressed", "true");
  });
});
