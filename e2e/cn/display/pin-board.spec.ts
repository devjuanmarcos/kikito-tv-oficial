import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/pin-board";

test.describe("PinBoard", () => {
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

  test("nota é focável e move com as setas do teclado", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const note = page.getByRole("button", { name: /Drag me around/ });
    await note.focus();
    const before = await note.evaluate((el) => (el as HTMLElement).style.left);
    await page.keyboard.press("ArrowRight");
    const after = await note.evaluate((el) => (el as HTMLElement).style.left);
    expect(after).not.toBe(before);
  });

  test("Delete no teclado remove a nota focada", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const note = page.getByRole("button", { name: /Drag me around/ });
    await note.focus();
    await page.keyboard.press("Delete");
    await expect(page.getByRole("button", { name: /Drag me around/ })).toHaveCount(0);
  });

  test("modo controlado: onChange atualiza a contagem exibida pelo pai", async ({ page, isMobile }) => {
    // pendência 0b já documentada: sidebar do showcase intercepta clique em mobile-chrome
    test.skip(isMobile, "pendência 0b: sidebar do showcase intercepta clique em mobile-chrome");
    const controlledFrame = page.locator("text=Pin Board — controlado").locator("..");
    await expect(controlledFrame.getByText("Pin Board — controlado (2 notas)")).toBeVisible();
    await controlledFrame.getByRole("button", { name: "Add note" }).click();
    await expect(controlledFrame.getByText("Pin Board — controlado (3 notas)")).toBeVisible();
  });
});
