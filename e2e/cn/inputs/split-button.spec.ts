import { test, expect } from "@playwright/test";

/**
 * Registrado no cn-registry.tsx mas nunca importado/referenciado em _showcase.tsx —
 * mesma classe de bug já fechada em outras páginas nesta e em sessões anteriores. Demo
 * criada e wired nesta validação.
 */
const URL = "/pt/cn/inputs/split-button";

test.describe("SplitButton (CN)", () => {
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

  test("clique no chevron abre o menu (role=menu, aria-haspopup)", async ({ page }) => {
    const chevron = page.getByRole("button", { name: "More options" }).first();
    await expect(chevron).toHaveAttribute("aria-haspopup", "menu");
    await expect(chevron).toHaveAttribute("aria-expanded", "false");
    await chevron.click();
    await expect(chevron).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("menu").first()).toBeVisible();
  });

  test("Escape fecha o menu aberto", async ({ page }) => {
    const chevron = page.getByRole("button", { name: "More options" }).first();
    await chevron.click();
    await expect(page.getByRole("menu").first()).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
  });

  test("clicar fora fecha o menu, item disabled nao dispara onClick", async ({ page }) => {
    const chevron = page.getByRole("button", { name: "More options" }).first();
    await chevron.click();
    const archiveItem = page.getByRole("menuitem", { name: "Archive" }).first();
    await expect(archiveItem).toBeDisabled();

    await page.mouse.click(5, 5);
    await expect(page.getByRole("menu")).toHaveCount(0);
  });
});
