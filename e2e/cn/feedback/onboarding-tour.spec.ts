import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/onboarding-tour";

test.describe("OnboardingTour", () => {
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

  test("Start Tour abre dialog focado e avança com Next", async ({ page }) => {
    await page.getByRole("button", { name: "Start Tour" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Welcome!")).toBeVisible();

    // Foco inicial vai pro primeiro elemento focável do painel na ordem do DOM
    // (o X "Close tour", que vem antes do rodapé Back/Next), não fica solto
    await expect(page.getByRole("button", { name: "Close tour" })).toBeFocused();

    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(dialog.getByText("Here's the component")).toBeVisible();
  });

  test("Tab não escapa do dialog (focus trap)", async ({ page }) => {
    await page.getByRole("button", { name: "Start Tour" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Único focável no 1º passo é "Next" (sem "Back") — Tab deve ciclar nele mesmo
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Next", exact: true })).toBeFocused();
  });

  test("Escape fecha o tour", async ({ page }) => {
    await page.getByRole("button", { name: "Start Tour" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
