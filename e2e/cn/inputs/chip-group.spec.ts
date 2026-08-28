import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/chip-group";

test.describe("ChipGroup (CN)", () => {
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

  test("single select: clicar num chip troca a selecao (nao acumula)", async ({ page }) => {
    await expect(page.getByText("Selected: react")).toBeVisible();
    await page.getByRole("button", { name: "Vue" }).first().click();
    await expect(page.getByText("Selected: vue")).toBeVisible();
  });

  test("multi select: clicar acumula selecao", async ({ page }) => {
    await expect(page.getByText("Selected: ts, tailwind")).toBeVisible();
    await page.getByRole("button", { name: "React", exact: true }).nth(1).click();
    await expect(page.getByText("Selected: ts, tailwind, react")).toBeVisible();
  });
});
