import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/segmented-control";

test.describe("SegmentedControl", () => {
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

  test("controlado: clicar num segmento atualiza o valor exibido", async ({ page }) => {
    const frame = page.locator('text="Controlled segmented control"').locator("..");
    await frame.getByRole("button", { name: "Grid" }).click();
    await expect(frame.getByText("Active: grid")).toBeVisible();
    await expect(frame.getByRole("button", { name: "Grid" })).toHaveAttribute("aria-pressed", "true");
  });
});
