import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/command";

test.describe("Command (CN)", () => {
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

  test("Cmd/Ctrl+K abre a paleta, Escape fecha", async ({ page }) => {
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toHaveCount(0);

    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("digitar filtra, ArrowDown+Enter seleciona, aria-activedescendant acompanha", async ({ page }) => {
    // a pagina de showcase tambem embute o variant "bar" (Command Bar, seção "Unificados")
    // com o mesmo role="listbox" — escopar ao dialog da paleta pra nao pegar o outro
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    const input = page.getByRole("combobox", { name: "Type a command…" });
    await expect(input).toBeVisible();

    await input.fill("theme");
    const listbox = dialog.locator('[role="listbox"]');
    await expect(listbox.getByText("Toggle Theme")).toBeVisible();
    await expect(listbox.getByText("Go to Home")).toHaveCount(0);

    await input.press("ArrowDown");
    const activeId = await input.getAttribute("aria-activedescendant");
    expect(activeId).toBeTruthy();

    // so uma opcao restou ("Toggle Theme"), o proprio Enter na primeira ja fecha a paleta
    await input.press("Enter");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toHaveCount(0);
  });
});
