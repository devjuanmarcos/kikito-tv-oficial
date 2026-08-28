import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/mini-map";

test.describe("MiniMap", () => {
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

  test("clique num dot navega e marca aria-current", async ({ page, isMobile }) => {
    // pendência 0b já documentada: em mobile-chrome a sidebar do showcase
    // (position: sticky) intercepta o clique no botão real — não é bug do MiniMap
    test.skip(isMobile, "pendência 0b: sidebar do showcase intercepta clique em mobile-chrome");
    const frame = page.locator("text=Mini Map — navegação por seções").locator("..");
    const apiButton = frame.getByRole("navigation").first().getByRole("button", { name: "API" });
    await apiButton.click();
    await expect(apiButton).toHaveAttribute("aria-current", "true");
  });

  test("dois <nav aria-label> renderizados (position left + right)", async ({ page }) => {
    const frame = page.locator("text=Mini Map — navegação por seções").locator("..");
    await expect(frame.getByRole("navigation")).toHaveCount(2);
  });
});
