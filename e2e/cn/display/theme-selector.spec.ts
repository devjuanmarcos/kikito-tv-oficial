import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/theme-selector";

test.describe("ThemeSelector", () => {
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

  test("clicar num tema seleciona e reflete aria-pressed + texto de estado", async ({ page }) => {
    const frame = page.locator("main");
    const ocean = frame.getByRole("button", { name: "Ocean" });
    const forest = frame.getByRole("button", { name: "Forest" });

    await expect(ocean).toHaveAttribute("aria-pressed", "true");
    await expect(forest).toHaveAttribute("aria-pressed", "false");

    await forest.click();

    await expect(forest).toHaveAttribute("aria-pressed", "true");
    await expect(ocean).toHaveAttribute("aria-pressed", "false");
    await expect(frame.getByText("forest", { exact: true })).toBeVisible();
  });
});
