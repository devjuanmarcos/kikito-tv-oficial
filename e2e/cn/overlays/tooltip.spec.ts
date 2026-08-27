import { test, expect } from "@playwright/test";

const URL = "/pt/cn/overlays/tooltip";

test.describe("Tooltip (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("dark mode: pagina nao quebra ao alternar", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
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

  test("tooltip aparece no hover e some no mouseleave", async ({ page }) => {
    // o portal do tooltip fica sempre montado (opacity-0 quando fechado), entao
    // a asserção é sobre a classe de visibilidade, nao sobre presença no DOM.
    const trigger = page.getByRole("button", { name: "top", exact: true }).first();
    const tooltip = page.getByText("Placement: top", { exact: true });

    await expect(tooltip).toHaveClass(/opacity-0/);
    await trigger.hover();
    await expect(tooltip).toHaveClass(/opacity-100/);
    await expect(trigger).toHaveAttribute("aria-describedby", /.+/);

    await page.mouse.move(0, 0);
    await expect(tooltip).toHaveClass(/opacity-0/);
  });
});
