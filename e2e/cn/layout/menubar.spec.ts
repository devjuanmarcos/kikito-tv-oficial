import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/menubar";

test.describe("Menubar", () => {
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

  test("clique abre o menu com aria-expanded correto, item fecha ao clicar", async ({ page }) => {
    const fileTrigger = page.getByRole("menuitem", { name: "File", exact: true });
    await expect(fileTrigger).toHaveAttribute("aria-expanded", "false");

    await fileTrigger.click();
    await expect(fileTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByText("New File")).toBeVisible();

    await page.getByText("New File").click();
    await expect(fileTrigger).toHaveAttribute("aria-expanded", "false");
  });

  test("passar o mouse por outro trigger troca de menu sem precisar clicar de novo", async ({ page }) => {
    const fileTrigger = page.getByRole("menuitem", { name: "File", exact: true });
    const editTrigger = page.getByRole("menuitem", { name: "Edit", exact: true });

    await fileTrigger.click();
    await expect(page.getByText("New File")).toBeVisible();

    await editTrigger.hover();
    await expect(editTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(fileTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Undo")).toBeVisible();
    await expect(page.getByText("New File")).not.toBeVisible();
  });

  test("hover sem nenhum menu aberto não abre nada", async ({ page }) => {
    const editTrigger = page.getByRole("menuitem", { name: "Edit", exact: true });
    await editTrigger.hover();
    await expect(editTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Undo")).not.toBeVisible();
  });

  test("menu disabled não abre ao clicar", async ({ page }) => {
    const helpTrigger = page.getByRole("menuitem", { name: "Help", exact: true });
    await expect(helpTrigger).toBeDisabled();
    await helpTrigger.click({ force: true });
    await expect(page.getByRole("menu")).toHaveCount(0);
  });

  test("clique fora fecha o menu aberto", async ({ page }) => {
    const fileTrigger = page.getByRole("menuitem", { name: "File", exact: true });
    await fileTrigger.click();
    await expect(page.getByRole("menu")).toBeVisible();

    await page.locator("h1").first().click();
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(fileTrigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape fecha o menu aberto", async ({ page }) => {
    const fileTrigger = page.getByRole("menuitem", { name: "File", exact: true });
    await fileTrigger.click();
    await expect(page.getByRole("menu")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
  });
});
