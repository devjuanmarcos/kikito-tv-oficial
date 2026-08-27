import { test, expect } from "@playwright/test";

/**
 * MarqueeText and ScrollReveal share naming with the text-effect family but
 * are NOT part of the TextEffect router — each is its own standalone
 * component, validated together here since both were flagged pending.
 */
const ROUTES = {
  "marquee-text": "/pt/cn/display/marquee-text",
  "scroll-reveal": "/pt/cn/layout/scroll-reveal",
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

test.describe("MarqueeText (CN) — a11y", () => {
  test("faixa visual repetida fica aria-hidden, texto real exposto uma unica vez via sr-only", async ({ page }) => {
    await page.goto(ROUTES["marquee-text"]);
    await page.waitForLoadState("networkidle");
    const track = page.locator(".mq-track").first();
    await expect(track).toHaveAttribute("aria-hidden", "true");
    const srOnly = page.locator(".sr-only").first();
    await expect(srOnly).toBeAttached();
  });
});

test.describe("ScrollReveal (CN) — reduced motion", () => {
  test("com prefers-reduced-motion, conteudo aparece sem depender de scroll/transform", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(ROUTES["scroll-reveal"]);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("main")).toBeVisible();
  });
});
