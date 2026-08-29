import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/marquee-text";

test.describe("MarqueeText", () => {
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

  test("texto real (sr-only) existe uma vez; faixa visual repetida fica aria-hidden", async ({ page }) => {
    const frame = page.locator("main");
    const srText = frame.locator(".sr-only", { hasText: "Open Source" });
    await expect(srText).toHaveCount(1);
    const track = srText.locator("..").locator(".mq-track");
    await expect(track).toHaveAttribute("aria-hidden", "true");
    const repeatedItems = track.locator(".mq-item");
    // repeat=8 (default do outro exemplo) não se aplica aqui, mas repeat*2 itens sempre
    const itemCount = await repeatedItems.count();
    expect(itemCount).toBeGreaterThan(1);
  });

  test("animação para com prefers-reduced-motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    const track = page.locator(".mq-track").first();
    const animationName = await track.evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).toBe("none");
  });
});
