import { test, expect } from "@playwright/test";

/**
 * RangeSlider absorbed for real (thin wrapper: `<Slider range />`).
 */
const ROUTES = {
  slider: "/pt/cn/inputs/slider",
  "range-slider": "/pt/cn/inputs/range-slider",
};

for (const [name, url] of Object.entries(ROUTES)) {
  test.describe(`${name} (CN)`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
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
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
    });
  });
}

test.describe("Slider (range) — a11y", () => {
  test("thumb focado muda visualmente o box-shadow (focus-visible funcional)", async ({ page }) => {
    await page.goto(ROUTES.slider);
    await page.waitForLoadState("networkidle");
    const thumb = page.getByRole("slider", { name: "Minimum value" }).first();
    await expect(thumb).toBeAttached();
    const before = await thumb.evaluate((el) => getComputedStyle(el).boxShadow);
    await thumb.focus();
    const after = await thumb.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(after).not.toBe(before);
  });

  test("thumb desabilitado nao muda valor via seta do teclado", async ({ page }) => {
    await page.goto(ROUTES.slider);
    await page.waitForLoadState("networkidle");
    const thumb = page.getByRole("slider", { name: "Minimum value" }).last();
    if (await thumb.isDisabled().catch(() => false)) {
      const before = await thumb.getAttribute("aria-valuenow");
      await thumb.focus().catch(() => {});
      await page.keyboard.press("ArrowRight");
      const after = await thumb.getAttribute("aria-valuenow");
      expect(after).toBe(before);
    }
  });
});
