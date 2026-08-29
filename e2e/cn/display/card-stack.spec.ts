import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/card-stack";

test.describe("CardStack", () => {
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

  test("teclado (Enter) avança o stack sem precisar de clique/mouse", async ({ page }) => {
    const frame = page.locator("main");
    const manualStack = frame.getByRole("button", { name: "Show next card" }).last();
    await expect(manualStack.getByText("Q4 Launch Ready")).toBeVisible();
    await manualStack.focus();
    await manualStack.press("Enter");
    await expect(manualStack.getByText("In Review")).toBeVisible();
  });

  test("cards obscurecidos atrás do topo ficam aria-hidden (só o topo fica exposto)", async ({ page }) => {
    const frame = page.locator("main");
    const manualStack = frame.getByRole("button", { name: "Show next card" }).last();
    const hiddenCards = manualStack.locator('[aria-hidden="true"]');
    // 3 cards no total, 1 no topo (visível) -> 2 obscurecidos
    await expect(hiddenCards).toHaveCount(2);
  });
});
