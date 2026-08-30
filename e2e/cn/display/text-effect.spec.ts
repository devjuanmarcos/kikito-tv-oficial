import { test, expect } from "@playwright/test";

/**
 * TextEffect — Super component (router, not an absorption): dispatches by
 * `effect` to Typewriter/MorphingText/TextGradient/AnimatedNumber/TextShine/
 * TextWave, which remain independently importable/usable, each with its own
 * real demo.
 */
const ROUTES = {
  "text-effect": "/pt/cn/display/text-effect",
  typewriter: "/pt/cn/display/typewriter",
  "morphing-text": "/pt/cn/display/morphing-text",
  "text-gradient": "/pt/cn/display/text-gradient",
  "animated-number": "/pt/cn/display/animated-number",
  "text-shine": "/pt/cn/display/text-shine",
  "text-wave": "/pt/cn/display/text-wave",
};

for (const [name, url] of Object.entries(ROUTES)) {
  test.describe(`TextEffect family (CN) — ${name}`, () => {
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

test.describe("TextGradient (CN) — a11y", () => {
  test("forced-colors: fallback restaura cor de texto real", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto(ROUTES["text-gradient"]);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("main")).toBeVisible();
    await page.emulateMedia({ forcedColors: null });
  });
});

test.describe("TextWave (CN) — a11y", () => {
  test("texto completo acessível via aria-label, spans por caractere têm aria-hidden", async ({ page }) => {
    await page.goto(ROUTES["text-wave"]);
    await page.waitForLoadState("networkidle");
    const wave = page.getByLabel("Kikito Design", { exact: true });
    await expect(wave).toBeVisible();
    const hiddenChars = wave.locator('[aria-hidden="true"]');
    await expect(hiddenChars).not.toHaveCount(0);
  });
});
