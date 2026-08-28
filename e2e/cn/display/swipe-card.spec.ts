import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/swipe-card";

test.describe("SwipeCard", () => {
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

  test("card do topo renderiza o children de verdade (não fica vazio)", async ({ page }) => {
    // Achado real: o componente ignorava `children` e renderizava campos
    // (title/subtitle) que não existem no item — card ficava vazio
    const frame = page.locator("text=Swipe Card — drag left/right to dismiss").locator("..");
    await expect(frame.getByText("Design Tokens")).toBeVisible();
    await expect(frame.getByText("Color, spacing, typography")).toBeVisible();
  });

  test("Skip dispara onSwipeLeft de verdade e traz o próximo card", async ({ page }) => {
    // Achado real: o componente chamava onSwipe/onEmpty (props que não existem),
    // então onSwipeLeft/onSwipeRight documentados nunca disparavam
    const frame = page.locator("text=Swipe Card — drag left/right to dismiss").locator("..");
    await expect(frame.getByText("Design Tokens")).toBeVisible();
    await frame.getByRole("button", { name: "Skip" }).click();
    await expect(frame.getByText("Design Tokens")).toHaveCount(0);
    await expect(frame.getByText("Component API")).toBeVisible();
  });

  test("Reset stack devolve o baralho ao estado inicial", async ({ page }) => {
    // Achado real: useState(items) só inicializava uma vez — mudar a prop
    // `items` (via "Reset stack") nunca resincronizava o estado interno
    const frame = page.locator("text=Swipe Card — drag left/right to dismiss").locator("..");
    await frame.getByRole("button", { name: "Skip" }).click();
    await frame.getByRole("button", { name: "Keep" }).click();
    await expect(frame.getByText("Accessibility")).toBeVisible();
    await frame.getByRole("button", { name: "Reset stack" }).click();
    await expect(frame.getByText("Design Tokens")).toBeVisible();
  });
});
