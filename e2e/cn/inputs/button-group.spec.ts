import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/button-group";

test.describe("ButtonGroup", () => {
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

  test("attached: botão do meio fica com os dois cantos quadrados, borda esquerda removida", async ({ page }) => {
    const frame = page.locator("main");
    const group = frame.getByRole("group", { name: "Text alignment" });
    const buttons = group.locator("button");
    const middle = buttons.nth(1);
    const radii = await middle.evaluate((el) => {
      const s = getComputedStyle(el);
      return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomLeftRadius, s.borderBottomRightRadius];
    });
    expect(radii.every((r) => r === "0px")).toBe(true);
    const borderLeftWidth = await middle.evaluate((el) => getComputedStyle(el).borderLeftWidth);
    expect(borderLeftWidth).toBe("0px");
  });

  test("attached=false: botões mantêm espaçamento e cantos arredondados próprios", async ({ page }) => {
    const frame = page.locator("main");
    const group = frame.getByRole("group", { name: "Quick actions" });
    const firstBtn = group.locator("button").first();
    const radius = await firstBtn.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
    expect(radius).not.toBe("0px");
  });
});
