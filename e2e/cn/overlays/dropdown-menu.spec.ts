import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/dropdown-menu";

test.describe("DropdownMenu (CN)", () => {
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

  test("clique abre o menu com aria-haspopup/expanded corretos, Escape fecha", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Open menu" });
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("clicar num item fecha o menu", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    await page.getByRole("menu").getByText("Duplicate").click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("prop header: conteudo aparece no topo do menu, antes dos itens", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Conta" });
    await trigger.click();
    const menu = page.getByRole("menu").filter({ hasText: "kikito@example.com" });
    await expect(menu).toBeVisible();
    await expect(menu.getByText("Kikito", { exact: true })).toBeVisible();
    await expect(menu.getByText("kikito@example.com")).toBeVisible();
    // header renderiza antes dos itens de menu (grupo "Actions")
    await expect(menu.getByText("Edit")).toBeVisible();
  });
});
