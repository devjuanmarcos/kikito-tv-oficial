import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/avatar-group";

test.describe("AvatarGroup", () => {
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

  test("achado real corrigido: bolha de overflow mostra +3 completo, não só +", async ({ page }) => {
    const frame = page.locator("main");
    // 7 avatares, max=4 -> overflow de 3
    await expect(frame.getByText("+3", { exact: true })).toBeVisible();
    await expect(frame.getByRole("img", { name: "3 more" })).toBeVisible();
  });

  test("grupo expõe role=group com contagem total de membros", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByRole("group", { name: "7 members" }).first()).toBeVisible();
  });
});
